import { pathToFileURL, fileURLToPath } from 'url';

import { setAdapter, removeAdapter } from '@vanilla-extract/css/adapter';
import { transformCss } from '@vanilla-extract/css/transformCss';
import {
  transform,
  cssFileFilter,
  getPackageInfo,
  serializeVanillaModule,
} from '@vanilla-extract/integration';
import { resolvePath } from 'mlly';
import { createServer, ModuleNode } from 'vite';
import { ViteNodeRunner } from 'vite-node/client';
import { ViteNodeServer } from 'vite-node/server';
import type { Adapter } from '@vanilla-extract/css';

import { lock } from './lock';

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

const getCssDeps = (
  module: ModuleNode,
  cssCache: Map<string, unknown>,
  cssDeps: Array<string> = [],
) => {
  if (module.id && cssCache.has(module.id)) {
    cssDeps.push(module.id!);
  }

  for (const importedModule of module.importedModules) {
    getCssDeps(importedModule, cssCache, cssDeps);
  }

  return cssDeps;
};

interface CreateCompilerParams {
  root: string;
  toCssImport: (filePath: string) => string;
  fromCssImport: (source: string) => string;
}
export const createCompiler = async ({
  root,
  toCssImport,
  fromCssImport,
}: CreateCompilerParams) => {
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
          if (source.includes('@vanilla-extract/')) {
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
    ],
  });

  const cssCache = new Map<
    string,
    {
      css: string;
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
      usedCompositions: Set<string>;
    }
  >();

  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({});

  // @ts-expect-error Types not lining up 🤷
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
    async processVanillaFile(filePath: string) {
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

      const result = await lock(async () => {
        setAdapter(cssAdapter);

        const result = await runner.executeFile(filePath);

        removeAdapter();

        return result;
      });

      const moduleNode = server.moduleGraph.getModuleById(filePath);

      if (!moduleNode) {
        throw new Error(`Can't find ModuleNode for ${filePath}`);
      }

      const cssImports = [];

      for (const moduleId of getCssDeps(moduleNode, cssCache)) {
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

      const unusedCompositions = composedClassLists
        .filter(({ identifier }) => !usedCompositions.has(identifier))
        .map(({ identifier }) => identifier);

      const unusedCompositionRegex =
        unusedCompositions.length > 0
          ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g')
          : null;

      return serializeVanillaModule(cssImports, result, unusedCompositionRegex);
    },
    getCssForFile(virtualCssFilePath: string) {
      const filePath = fromCssImport(virtualCssFilePath);

      const result = cssCache.get(filePath);

      if (result) {
        return {
          css: result.css,
          filePath,
        };
      }
    },
    async close() {
      await server.close();
    },
  };
};
