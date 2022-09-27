import { pathToFileURL, fileURLToPath } from 'url';

import { setAdapter, removeAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import { resolvePath } from 'mlly';
import { createServer, ModuleNode } from 'vite';
import { ViteNodeRunner } from 'vite-node/client';
import { ViteNodeServer } from 'vite-node/server';
import type { Adapter } from '@vanilla-extract/css';
import tsconfigPaths from 'vite-tsconfig-paths';

import { lock } from './lock';
import { getPackageInfo } from './packageInfo';
import { cssFileFilter } from './filters';
import { serializeVanillaModule } from './processVanillaFile';
import { transform } from './transform';

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

const scanModule = (
  enrtyModule: ModuleNode,
  cssCache: Map<string, unknown>,
) => {
  const queue = [enrtyModule];
  const cssDeps = new Set<string>();
  const watchFiles = new Set<string>();

  for (const moduleNode of queue) {
    if (moduleNode.id && cssCache.has(moduleNode.id)) {
      cssDeps.add(moduleNode.id!);
    }

    if (moduleNode.file) {
      watchFiles.add(moduleNode.file);
    }

    for (const importedModule of moduleNode.importedModules) {
      queue.push(importedModule);
    }
  }

  return { cssDeps, watchFiles };
};

const createViteServer = async (root: string) => {
  const pkg = getPackageInfo(root);

  const server = await createServer({
    root,
    server: {
      hmr: false,
    },
    logLevel: 'silent',
    optimizeDeps: {
      disabled: true,
    },
    plugins: [
      {
        name: 'vanilla-extract-externalize',
        enforce: 'pre',
        async resolveId(source, importer) {
          if (source.startsWith('@vanilla-extract/')) {
            return {
              external: true,
              id: await resolvePath(source, { url: pathToFileURL(importer!) }),
            };
          }
        },
      },
      {
        name: 'vanilla-extract-transform',
        async transform(code, id) {
          if (cssFileFilter.test(id)) {
            const filescopedCode = await transform({
              source: code,
              rootPath: root,
              filePath: id,
              packageName: pkg.name,
              identOption: 'debug',
            });

            return filescopedCode;
          }
        },
      },
      tsconfigPaths({ root }),
    ],
  });

  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({});

  const node = new ViteNodeServer(server);

  const runner = new ViteNodeRunner({
    root,
    base: server.config.base,
    fetchModule(id) {
      return node.fetchModule(id);
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer);
    },
  });

  server.watcher.on('change', (filePath) => {
    runner.moduleCache.invalidateDepTree([filePath]);
  });

  return {
    server,
    runner,
  };
};

export interface Compiler {
  processVanillaFile(
    filePath: string,
  ): Promise<{ source: string; watchFiles: Set<string> }>;
  getCssForFile(virtualCssFilePath: string): { filePath: string; css: string };
  close(): Promise<void>;
}

export interface CreateCompilerParams {
  root: string;
  toCssImport: (filePath: string) => string;
}
export const createCompiler = ({
  root,
  toCssImport,
}: CreateCompilerParams): Compiler => {
  const vitePromise = createViteServer(root);

  const cssCache = new Map<
    string,
    {
      css: string;
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
      usedCompositions: Set<string>;
    }
  >();

  return {
    async processVanillaFile(filePath: string) {
      const { server, runner } = await vitePromise;

      const cssByFileScope = new Map<string, Array<Css>>();
      const localClassNames = new Set<string>();
      const composedClassLists: Array<Composition> = [];
      const usedCompositions = new Set<string>();

      const executedUrls: Array<string> = [];

      const cssAdapter: Adapter = {
        appendCss: (css, fileScope) => {
          const fileScopeCss = cssByFileScope.get(fileScope.url!) ?? [];

          fileScopeCss.push(css);

          cssByFileScope.set(fileScope.url!, fileScopeCss);
        },
        registerClassName: (className) => {
          localClassNames.add(className);
        },
        registerComposition: (composedClassList) => {
          composedClassLists.push(composedClassList);
        },
        markCompositionUsed: (identifier) => {
          usedCompositions.add(identifier);
        },
        onEndFileScope: (fileScope) => {
          executedUrls.push(fileScope.url!);
        },
        getIdentOption: () => 'debug',
      };

      const { fileExports, cssImports, watchFiles } = await lock(async () => {
        setAdapter(cssAdapter);

        const fileExports = await runner.executeFile(filePath);

        const moduleNode = server.moduleGraph.getModuleById(filePath);

        if (!moduleNode) {
          throw new Error(`Can't find ModuleNode for ${filePath}`);
        }

        const cssImports = [];

        const { cssDeps, watchFiles } = scanModule(moduleNode, cssCache);

        for (const moduleId of cssDeps) {
          const cssEntry = cssCache.get(moduleId);

          if (!cssEntry) {
            throw new Error(`No CSS Entry in cache for ${moduleId}`);
          }

          cssImports.push(`import '${toCssImport(filePath)}';`);

          cssEntry.localClassNames.forEach((localClassName) => {
            localClassNames.add(localClassName);
          });
          cssEntry.usedCompositions.forEach((usedComposition) => {
            usedCompositions.add(usedComposition);
          });
          composedClassLists.push(...cssEntry.composedClassLists);
        }

        for (const url of executedUrls) {
          const css = transformCss({
            localClassNames: Array.from(localClassNames),
            composedClassLists,
            cssObjs: cssByFileScope.get(url)!,
          }).join('\n');

          const moduleId = fileURLToPath(url);

          cssImports.push(`import '${toCssImport(moduleId)}';`);

          cssCache.set(moduleId, {
            localClassNames,
            composedClassLists,
            usedCompositions,
            css,
          });
        }

        removeAdapter();

        return { fileExports, cssImports, watchFiles };
      });

      const unusedCompositions = composedClassLists
        .filter(({ identifier }) => !usedCompositions.has(identifier))
        .map(({ identifier }) => identifier);

      const unusedCompositionRegex =
        unusedCompositions.length > 0
          ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g')
          : null;

      return {
        source: serializeVanillaModule(
          cssImports,
          fileExports,
          unusedCompositionRegex,
        ),
        watchFiles,
      };
    },
    getCssForFile(filePath: string) {
      const result = cssCache.get(filePath);

      if (!result) {
        throw new Error(`No CSS for file: ${filePath}`);
      }

      return {
        css: result.css,
        filePath,
      };
    },
    async close() {
      const { server } = await vitePromise;

      await server.close();
    },
  };
};
