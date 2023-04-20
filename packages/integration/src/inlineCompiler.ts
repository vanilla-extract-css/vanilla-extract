import { join, relative, isAbsolute } from 'path';
import type { Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
import type { ModuleNode, Plugin as VitePlugin } from 'vite';
import type { ViteNodeRunner } from 'vite-node/client';
import { findStaticImports, parseStaticImport } from 'mlly';

import type { IdentifierOption } from './types';
import { getPackageInfo } from './packageInfo';
import { transform } from './inlineTransform';
import { lock } from './lock';
import { cssFileFilter } from './filters';
import { serializeVanillaModule } from './inlineExportSerializer';

const firstPartyMacros: Record<string, Array<string>> = {
  '@vanilla-extract/css': [
    'css$',
    'style$',
    'styleVariants$',
    'globalStyle$',
    'keyframes$',
    'globalKeyframes$',
    'fontFace$',
    'globalFontFace$',
  ],
  '@vanilla-extract/recipes': ['recipe$'],
  '@vanilla-extract/sprinkles': ['createSprinkles$'],
};

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

const globalAdapterIdentifier = '__vanilla_globalCssAdapter__';

const scanModule = (entryModule: ModuleNode, root: string) => {
  const queue = [entryModule];
  const cssDeps = new Set<string>();
  const watchFiles = new Set<string>();

  for (const moduleNode of queue) {
    const relativePath = moduleNode.id && relative(root, moduleNode.id);

    if (relativePath) {
      cssDeps.add(relativePath);
    }

    if (moduleNode.file) {
      watchFiles.add(moduleNode.file);
    }

    queue.push(...moduleNode.importedModules);
  }

  // This ensures the root module's styles are last in terms of CSS ordering
  const [head, ...tail] = cssDeps;

  return { cssDeps: [...tail, head], watchFiles };
};

// We lazily load this utility from Vite
let normalizeModuleId: (fsPath: string) => string;

const createViteServer = async ({
  root,
  identifiers,
  vitePlugins = [],
}: {
  root: string;
  identifiers: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}) => {
  const pkg = getPackageInfo(root);
  const vite = await import('vite');

  const transformCache = new Map<
    string,
    { buildtime: string; runtime: string }
  >();

  normalizeModuleId = vite.normalizePath;

  const server = await vite.createServer({
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
            const result = await this.resolve(source, importer, {
              skipSelf: true,
            });

            return result ? { ...result, external: true } : null;
          }
        },
      },
      {
        name: 'vanilla-extract-transform',
        async transform(code, id) {
          let macros: Array<string> = ['css$'];

          if (!cssFileFilter.test(id)) {
            if (!code.includes('$')) {
              // Super fast bailout for code not containing a '$' character
              return;
            }

            const relevantImports = findStaticImports(code)
              .map((rawImport) => {
                const { namedImports, specifier } =
                  parseStaticImport(rawImport);

                return { namedImports, specifier };
              })
              .filter(
                ({ namedImports }) =>
                  namedImports &&
                  Object.keys(namedImports).some((identifier) =>
                    identifier.endsWith('$'),
                  ),
              );

            if (relevantImports.length === 0) {
              return;
            }

            const result = await Promise.all(
              relevantImports.map(async ({ specifier, namedImports }) => {
                let importMacros = firstPartyMacros[specifier];

                if (!importMacros) {
                  const resolved = await this.resolve(specifier, id);

                  if (!resolved) {
                    throw new Error(
                      `Can't resolve "${specifier}" from "${id}"`,
                    );
                  }

                  const { config } = getPackageInfo(resolved.id);
                  importMacros = config.macros || [];
                }

                return importMacros
                  .map((macro) => namedImports![macro])
                  .filter(Boolean);
              }),
            );

            macros = result.flat();

            if (macros.length === 0) {
              return;
            }
          }

          const transformResult = await transform({
            source: code,
            rootPath: root,
            filePath: id,
            packageName: pkg.name,
            identOption: identifiers,
            globalAdapterIdentifier,
            macros,
          });

          transformCache.set(id, transformResult);

          // console.log(id, transformResult);

          return transformResult.buildtime;
        },
      },
      ...vitePlugins,
    ],
  });

  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({});

  const { ViteNodeRunner } = await import('vite-node/client');
  const { ViteNodeServer } = await import('vite-node/server');

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
    transformCache,
  };
};

export interface InlineCompiler {
  processVanillaFile(
    filePath: string,
    options?: {
      outputCss?: boolean;
      cssImportSpecifier?: (
        filePath: string,
        css: string,
        root: string,
      ) => Promise<string> | string;
    },
  ): Promise<{ source: string; watchFiles: Set<string> } | null>;
  getCssForFile(virtualCssFilePath: string): { filePath: string; css: string };
  close(): Promise<void>;
}

interface ProcessedVanillaFile {
  source: string;
  watchFiles: Set<string>;
}

export interface CreateInlineCompilerOptions {
  root: string;
  identifiers?: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}
export const createInlineCompiler = ({
  root,
  identifiers = 'debug',
  vitePlugins,
}: CreateInlineCompilerOptions): InlineCompiler => {
  let originalPrepareContext: ViteNodeRunner['prepareContext'];

  const vitePromise = createViteServer({
    root,
    identifiers,
    vitePlugins,
  }).then(({ server, runner, transformCache }) => {
    // Store the original method so we can monkey patch it on demand
    originalPrepareContext = runner.prepareContext;
    return { server, runner, transformCache };
  });

  const cssCache = new Map<string, { css: string }>();

  const processVanillaFileCache = new Map<
    string,
    {
      lastInvalidationTimestamp: number;
      result: ProcessedVanillaFile;
    }
  >();

  const classRegistrationsByModuleId = new Map<
    string,
    {
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
    }
  >();

  return {
    async processVanillaFile(
      filePath,
      {
        outputCss = true,
        cssImportSpecifier = (filePath: string) => filePath + '.vanilla.css',
      } = {},
    ): Promise<ProcessedVanillaFile | null> {
      const { server, runner, transformCache } = await vitePromise;

      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);

      const cacheKey = Object.entries({ filePath, outputCss })
        .map((entry) => entry.join('='))
        .join('|');
      const cachedFile = processVanillaFileCache.get(cacheKey);
      if (cachedFile) {
        const moduleNode = server.moduleGraph.getModuleById(filePath);
        if (
          cachedFile.lastInvalidationTimestamp ===
          moduleNode?.lastInvalidationTimestamp
        ) {
          return cachedFile.result;
        }
      }

      const cssByModuleId = new Map<string, Array<Css>>();
      const localClassNames = new Set<string>();
      const composedClassLists: Array<Composition> = [];

      const cssAdapter: Adapter = {
        getIdentOption: () => identifiers,
        onBeginFileScope: (fileScope) => {
          // Before evaluating a file, reset the cache for it
          const moduleId = normalizeModuleId(fileScope.filePath);
          cssByModuleId.set(moduleId, []);
          classRegistrationsByModuleId.set(moduleId, {
            localClassNames: new Set(),
            composedClassLists: [],
          });
        },
        onEndFileScope: ({ filePath }) => {
          // For backwards compatibility, ensure the cache is populated even if
          // a file didn't contain any CSS. This is to ensure that the only
          // error messages shown in older versions are the ones below.
          const moduleId = normalizeModuleId(filePath);
          const cssObjs = cssByModuleId.get(moduleId) ?? [];
          cssByModuleId.set(moduleId, cssObjs);
        },
        registerClassName: (className, fileScope) => {
          if (!fileScope) {
            throw new Error(
              'Your version of @vanilla-extract/css must be at least v1.10.0. Please update to a compatible version.',
            );
          }

          localClassNames.add(className);

          const moduleId = normalizeModuleId(fileScope.filePath);
          classRegistrationsByModuleId
            .get(moduleId)!
            .localClassNames.add(className);
        },
        registerComposition: (composedClassList, fileScope) => {
          if (!fileScope) {
            throw new Error(
              'Your version of @vanilla-extract/css must be at least v1.10.0. Please update to a compatible version.',
            );
          }

          composedClassLists.push(composedClassList);

          const moduleId = normalizeModuleId(fileScope.filePath);
          classRegistrationsByModuleId
            .get(moduleId)!
            .composedClassLists.push(composedClassList);
        },
        markCompositionUsed: () => {
          // This compiler currently retains all composition classes
        },
        appendCss: (css, fileScope) => {
          const moduleId = normalizeModuleId(fileScope.filePath);
          const cssObjs = cssByModuleId.get(moduleId) ?? [];
          cssObjs.push(css);

          cssByModuleId.set(moduleId, cssObjs);
        },
      };

      const { fileExports, cssImports, watchFiles, lastInvalidationTimestamp } =
        await lock(async () => {
          // Monkey patch the prepareContext method to inject the adapter
          runner.prepareContext = function (...args) {
            return {
              ...originalPrepareContext.apply(this, args),
              [globalAdapterIdentifier]: cssAdapter,
            };
          };

          // console.log('Execute file', filePath);
          const fileExports = await runner.executeFile(filePath);

          const moduleId = normalizeModuleId(filePath);
          const moduleNode = server.moduleGraph.getModuleById(moduleId);

          if (!moduleNode) {
            throw new Error(`Can't find ModuleNode for ${filePath}`);
          }

          const cssImports = [];

          const { cssDeps, watchFiles } = scanModule(moduleNode, root);

          for (const cssDep of cssDeps) {
            const cssDepModuleId = normalizeModuleId(cssDep);
            const cssObjs = cssByModuleId.get(cssDepModuleId);
            const cachedCss = cssCache.get(cssDepModuleId);
            const cachedClassRegistrations =
              classRegistrationsByModuleId.get(cssDepModuleId);

            if (!cssObjs && !cachedCss && !cachedClassRegistrations) {
              continue;
            }

            if (cssObjs) {
              const css = transformCss({
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
                `import '${await cssImportSpecifier(
                  cssDepModuleId,
                  cssCache.get(cssDepModuleId)?.css!,
                  root,
                )}';`,
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

      const runtimeCode = transformCache.get(filePath)?.runtime;

      if (typeof runtimeCode !== 'string') {
        // This likely means the file doesn't have any vanilla-extract related code
        return null;
      }

      const newRuntimeSource = serializeVanillaModule(
        cssImports,
        fileExports,
        null, // This compiler currently retains all composition classes
        runtimeCode,
      );

      const result: ProcessedVanillaFile = {
        source: newRuntimeSource,
        watchFiles,
      };

      processVanillaFileCache.set(cacheKey, {
        lastInvalidationTimestamp,
        result,
      });

      return result;
    },
    getCssForFile(filePath: string) {
      if (!normalizeModuleId) {
        throw new Error(
          `Compiler is still loading. No CSS for file: ${filePath}`,
        );
      }

      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);
      const rootRelativePath = relative(root, filePath);

      const moduleId = normalizeModuleId(rootRelativePath);
      const result = cssCache.get(moduleId);

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
      const { server } = await vitePromise;

      await server.close();
    },
  };
};
