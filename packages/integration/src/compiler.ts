import { join, relative, isAbsolute } from 'path';
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

const globalAdapterIdentifier = '__vanilla_globalCssAdapter__';

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
              globalAdapterIdentifier,
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
    options?: {
      outputCss?: boolean;
    },
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
  cssImportSpecifier?: (filePath: string) => string;
  identifiers?: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}
export const createCompiler = ({
  root,
  identifiers = 'debug',
  cssImportSpecifier = (filePath) => filePath + '.vanilla.css',
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

  let cssCache = new Map<string, { css: string }>();

  let processVanillaFileCache = new Map<
    string,
    {
      lastInvalidationTimestamp: number;
      result: ProcessedVanillaFile;
    }
  >();

  const classRegistrationsByFileScope = new Map<
    string,
    {
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
    }
  >();

  return {
    async processVanillaFile(
      filePath,
      options = {},
    ): Promise<ProcessedVanillaFile> {
      let { server, runner } = await vitePromise;

      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);
      const outputCss = options.outputCss ?? true;

      const cacheKey = Object.entries({ filePath, outputCss })
        .map((entry) => entry.join('='))
        .join('|');
      let cachedFile = processVanillaFileCache.get(cacheKey);
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

      let cssAdapter: Adapter = {
        getIdentOption: () => identifiers,
        onBeginFileScope: (fileScope) => {
          // Before evaluating a file, reset the cache for it
          cssByFileScope.set(fileScope.filePath, []);
          classRegistrationsByFileScope.set(fileScope.filePath, {
            localClassNames: new Set(),
            composedClassLists: [],
          });
        },
        onEndFileScope: () => {},
        registerClassName: (className, fileScope) => {
          localClassNames.add(className);

          classRegistrationsByFileScope
            .get(fileScope.filePath)!
            .localClassNames.add(className);
        },
        registerComposition: (composedClassList, fileScope) => {
          composedClassLists.push(composedClassList);

          classRegistrationsByFileScope
            .get(fileScope.filePath)!
            .composedClassLists.push(composedClassList);
        },
        markCompositionUsed: () => {
          // This compiler currently retains all composition classes
        },
        appendCss: (css, fileScope) => {
          let fileScopeCss = cssByFileScope.get(fileScope.filePath) ?? [];
          fileScopeCss.push(css);
          cssByFileScope.set(fileScope.filePath, fileScopeCss);
        },
      };

      let { fileExports, cssImports, watchFiles, lastInvalidationTimestamp } =
        await lock(async () => {
          // Monkey patch the prepareContext method to inject the adapter
          runner.prepareContext = function (...args) {
            return {
              ...originalPrepareContext.apply(this, args),
              [globalAdapterIdentifier]: cssAdapter,
            };
          };

          let fileExports = await runner.executeFile(filePath);

          let moduleNode = server.moduleGraph.getModuleById(filePath);

          if (!moduleNode) {
            throw new Error(`Can't find ModuleNode for ${filePath}`);
          }

          let cssImports = [];

          let { cssDeps, watchFiles } = scanModule(moduleNode, root);

          for (let cssDepModuleId of cssDeps) {
            let cssObjs = cssByFileScope.get(cssDepModuleId);
            let cachedCss = cssCache.get(cssDepModuleId);
            let cachedClassRegistrations =
              classRegistrationsByFileScope.get(cssDepModuleId);

            if (!cssObjs && !cachedCss && !cachedClassRegistrations) {
              continue;
            }

            if (cssObjs) {
              let css = transformCss({
                localClassNames: Array.from(localClassNames),
                composedClassLists,
                cssObjs,
              }).join('\n');

              cssCache.set(cssDepModuleId, { css });
            } else if (cachedClassRegistrations) {
              cachedClassRegistrations.localClassNames.forEach(
                (localClassName) => {
                  localClassNames.add(localClassName);
                },
              );
              composedClassLists.push(
                ...cachedClassRegistrations.composedClassLists,
              );
            }

            if (cssObjs || cachedCss?.css) {
              cssImports.push(
                `import '${cssImportSpecifier(cssDepModuleId)}';`,
              );
            }
          }

          return {
            fileExports,
            cssImports: outputCss ? cssImports : [],
            watchFiles,
            lastInvalidationTimestamp: moduleNode.lastInvalidationTimestamp,
          };
        });

      let result: ProcessedVanillaFile = {
        source: serializeVanillaModule(
          cssImports,
          fileExports,
          null, // This compiler currently retains all composition classes
        ),
        watchFiles,
      };

      processVanillaFileCache.set(cacheKey, {
        lastInvalidationTimestamp,
        result,
      });

      return result;
    },
    getCssForFile(filePath: string) {
      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);
      let rootRelativePath = relative(root, filePath);
      let result = cssCache.get(rootRelativePath);

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
