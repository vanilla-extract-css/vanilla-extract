import { relative } from 'path';
import type { Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
import type { ModuleNode, Plugin as VitePlugin } from 'vite';
import type { ViteNodeRunner } from 'vite-node/client';

import type { IdentifierOption } from './types';
import { cssFileFilter } from './filters';
import { getPackageInfo } from './packageInfo';
import { transform } from './transform';
import { lock } from './lock';
import { serializeVanillaModule } from './processVanillaFile';

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

const globalCssAdapterKey = '__vanilla_globalCssAdapter__';

const scanModule = (entryModule: ModuleNode, root: string) => {
  let queue = [entryModule];
  let cssDeps = new Set<string>();
  let watchFiles = new Set<string>();

  for (let moduleNode of queue) {
    let relativePath = moduleNode.id && relative(root, moduleNode.id);

    if (relativePath) {
      cssDeps.add(relativePath);
    }

    if (moduleNode.file) {
      watchFiles.add(moduleNode.file);
    }

    for (let importedModule of moduleNode.importedModules) {
      queue.push(importedModule);
    }
  }

  // This ensures the root module's styles are last in terms of CSS ordering
  let [head, ...tail] = cssDeps;

  return { cssDeps: [...tail, head], watchFiles };
};

const createViteServer = async ({
  root,
  identifiers,
  vitePlugins = [],
}: {
  root: string;
  identifiers: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}) => {
  let pkg = getPackageInfo(root);
  let { createServer } = await import('vite');

  let server = await createServer({
    root,
    server: {
      hmr: false,
    },
    logLevel: 'silent',
    optimizeDeps: {
      disabled: true,
    },
    ssr: {
      noExternal: true,
    },
    plugins: [
      {
        name: 'vanilla-extract-externalize',
        enforce: 'pre',
        async resolveId(source, importer) {
          if (source.startsWith('@vanilla-extract/')) {
            let result = await this.resolve(source, importer, {
              skipSelf: true,
            });

            return result ? { ...result, external: true } : null;
          }
        },
      },
      {
        name: 'vanilla-extract-transform',
        async transform(code, id) {
          if (cssFileFilter.test(id)) {
            let filescopedCode = await transform({
              source: code,
              rootPath: root,
              filePath: id,
              packageName: pkg.name,
              identOption: identifiers,
              globalCssAdapterKey,
            });

            return filescopedCode;
          }
        },
      },
      ...vitePlugins,
    ],
  });

  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({});

  let { ViteNodeRunner } = await import('vite-node/client');
  let { ViteNodeServer } = await import('vite-node/server');

  let node = new ViteNodeServer(server);

  let runner = new ViteNodeRunner({
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
    outputCss: boolean,
  ): Promise<{ source: string; watchFiles: Set<string> }>;
  getCssForFile(virtualCssFilePath: string): { filePath: string; css: string };
  close(): Promise<void>;
}

interface ProcessedVanillaFile {
  source: string;
  watchFiles: Set<string>;
}

export interface CreateCompilerOptions {
  root: string;
  toCssImport: (filePath: string) => string;
  identifiers?: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}
export const createCompiler = ({
  root,
  identifiers = 'debug',
  toCssImport,
  vitePlugins,
}: CreateCompilerOptions): Compiler => {
  let originalPrepareContext: ViteNodeRunner['prepareContext'];

  let vitePromise = createViteServer({
    root,
    identifiers,
    vitePlugins,
  }).then(({ server, runner }) => {
    // Store the original method so we can monkey patch it on demand
    originalPrepareContext = runner.prepareContext;
    return { server, runner };
  });

  let adapterResultCache = new Map<
    string,
    {
      css: string;
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
      usedCompositions: Set<string>;
    }
  >();

  let processVanillaFileCache = new Map<
    string,
    {
      lastInvalidationTimestamp: number;
      result: ProcessedVanillaFile;
    }
  >();

  return {
    async processVanillaFile(
      filePath,
      outputCss,
    ): Promise<ProcessedVanillaFile> {
      let { server, runner } = await vitePromise;

      let cachedFile = processVanillaFileCache.get(filePath);
      if (cachedFile) {
        let moduleNode = server.moduleGraph.getModuleById(filePath);
        if (
          cachedFile.lastInvalidationTimestamp ===
          moduleNode?.lastInvalidationTimestamp
        ) {
          return cachedFile.result;
        }
      }

      let cssByFileScope = new Map<string, Array<Css>>();
      let localClassNames = new Set<string>();
      let composedClassLists: Array<Composition> = [];
      let usedCompositions = new Set<string>();

      let cssAdapter: Adapter = {
        appendCss: (css, fileScope) => {
          let fileScopeCss = cssByFileScope.get(fileScope.filePath) ?? [];
          fileScopeCss.push(css);
          cssByFileScope.set(fileScope.filePath, fileScopeCss);
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
        onEndFileScope: () => {},
        getIdentOption: () => identifiers,
      };

      let { fileExports, cssImports, watchFiles, lastInvalidationTimestamp } =
        await lock(async () => {
          // Monkey patch the prepareContext method to inject the adapter
          runner.prepareContext = function (...args) {
            return {
              ...originalPrepareContext.apply(this, args),
              [globalCssAdapterKey]: cssAdapter,
            };
          };

          runner.prepareContext({ [globalCssAdapterKey]: cssAdapter });

          let fileExports = await runner.executeFile(filePath);

          let moduleNode = server.moduleGraph.getModuleById(filePath);

          if (!moduleNode) {
            throw new Error(`Can't find ModuleNode for ${filePath}`);
          }

          let cssImports = [];

          let { cssDeps, watchFiles } = scanModule(moduleNode, root);

          for (let cssDepModuleId of cssDeps) {
            let cssObjs = cssByFileScope.get(cssDepModuleId);
            let cachedAdapterResult = adapterResultCache.get(cssDepModuleId);

            if (!cssObjs && !cachedAdapterResult) {
              continue;
            }

            if (cssObjs) {
              let css = transformCss({
                localClassNames: Array.from(localClassNames),
                composedClassLists,
                cssObjs,
              }).join('\n');

              adapterResultCache.set(cssDepModuleId, {
                localClassNames,
                composedClassLists,
                usedCompositions,
                css,
              });
            } else if (cachedAdapterResult) {
              cachedAdapterResult.localClassNames.forEach((localClassName) => {
                localClassNames.add(localClassName);
              });
              cachedAdapterResult.usedCompositions.forEach(
                (usedComposition) => {
                  usedCompositions.add(usedComposition);
                },
              );
              composedClassLists.push(
                ...cachedAdapterResult.composedClassLists,
              );
            }

            cssImports.push(`import '${toCssImport(cssDepModuleId)}';`);
          }

          return {
            fileExports,
            cssImports: outputCss ? cssImports : [],
            watchFiles,
            lastInvalidationTimestamp: moduleNode.lastInvalidationTimestamp,
          };
        });

      let unusedCompositions = composedClassLists
        .filter(({ identifier }) => !usedCompositions.has(identifier))
        .map(({ identifier }) => identifier);

      let unusedCompositionRegex =
        unusedCompositions.length > 0
          ? RegExp(`(${unusedCompositions.join('|')})\\s`, 'g')
          : null;

      let result: ProcessedVanillaFile = {
        source: serializeVanillaModule(
          cssImports,
          fileExports,
          unusedCompositionRegex,
        ),
        watchFiles,
      };

      processVanillaFileCache.set(filePath, {
        lastInvalidationTimestamp,
        result,
      });

      return result;
    },
    getCssForFile(filePath: string) {
      let rootRelativePath = relative(root, filePath);
      let result = adapterResultCache.get(rootRelativePath);

      if (!result) {
        throw new Error(`No CSS for file: ${filePath}`);
      }

      return {
        css: result.css,
        filePath: rootRelativePath,
        resolveDir: root,
      };
    },
    async close() {
      let { server } = await vitePromise;

      await server.close();
    },
  };
};
