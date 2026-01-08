import assert from 'assert';
import { join, isAbsolute } from 'path';
import type { Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
import type { ModuleNode, UserConfig as ViteUserConfig } from 'vite';

import {
  cssFileFilter,
  transform,
  normalizePath,
  getPackageInfo,
  serializeVanillaModule,
  type IdentifierOption,
} from '@vanilla-extract/integration';
import { lock } from './lock';

type Css = Parameters<Adapter['appendCss']>[0];
type Composition = Parameters<Adapter['registerComposition']>[0];

const globalAdapterIdentifier = '__vanilla_globalCssAdapter__';

type ModuleScanResult = {
  cssDeps: string[];
  watchFiles: Set<string>;
};

const createModuleScanner = () => {
  const cache = new Map<string, ModuleScanResult>();

  const scanModule = (
    moduleNode: ModuleNode,
    path: string[] = [],
  ): ModuleScanResult => {
    const watchFiles = new Set<string>();
    const cacheKey = moduleNode.id ?? moduleNode.file;

    if (
      !cacheKey ||
      moduleNode.id?.includes('@vanilla-extract/') ||
      path.includes(cacheKey)
    ) {
      return {
        cssDeps: [],
        watchFiles,
      };
    }

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)!;
    }

    cache.set(cacheKey, {
      cssDeps: [],
      watchFiles,
    });

    const cssDeps = new Set<string>();

    const currentPath = [...path, cacheKey];

    for (const dependencyNode of moduleNode.importedModules) {
      const { cssDeps: dependencyCssDeps, watchFiles: dependencyWatchFiles } =
        scanModule(dependencyNode, currentPath);

      dependencyCssDeps.forEach((file) => cssDeps.add(file));
      dependencyWatchFiles.forEach((file) => watchFiles.add(file));
    }

    const cssDepsArray = Array.from(cssDeps);

    if (moduleNode.id && cssFileFilter.test(moduleNode.id)) {
      cssDepsArray.push(moduleNode.id);
    }

    if (moduleNode.file) {
      watchFiles.add(moduleNode.file);
    }

    const scanResult = {
      cssDeps: cssDepsArray,
      watchFiles,
    };

    cache.set(cacheKey, scanResult);

    return scanResult;
  };

  return scanModule;
};

const createViteServer = async ({
  root,
  identifiers,
  viteConfig,
  enableFileWatcher = true,
}: Required<
  Pick<CreateCompilerOptions, 'root' | 'identifiers' | 'viteConfig'>
> &
  Pick<CreateCompilerOptions, 'enableFileWatcher'>) => {
  const pkg = getPackageInfo(root);
  const vite = await import('vite');

  const server = await vite.createServer({
    ...viteConfig,
    // The vite-node server should not rewrite imported asset URLs within VE stylesheets.
    // Doing so interferes with Vite's resolution and bundling of these assets at build time.
    base: undefined,
    configFile: false,
    root,
    server: {
      hmr: false,
      watch: enableFileWatcher ? viteConfig.server?.watch : null,
    },
    logLevel: 'silent',
    optimizeDeps: {
      noDiscovery: true,
    },
    build: {
      dynamicImportVarsOptions: {
        // Temporary workaround for https://github.com/vitejs/vite/issues/19245.
        // Shouldn't affect functionality as it's equivalent to the default value.
        // Can be removed once https://github.com/vitejs/vite/pull/19247 is released.
        exclude: [/node_modules/],
      },
      assetsInlineLimit: viteConfig.build?.assetsInlineLimit,
    },
    ssr: {
      noExternal: true,
      // `cssesc` is CJS-only, so we need to mark it as external as Vite's transform pipeline
      // can't handle CJS during dev-time.
      // See https://github.com/withastro/astro/blob/0879cc2ce7e15a2e7330c68d6667d9a2edea52ab/packages/astro/src/core/create-vite.ts#L86
      // and https://github.com/withastro/astro/issues/11395
      external: ['cssesc'],
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
          if (cssFileFilter.test(id)) {
            const filescopedCode = await transform({
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
      ...(viteConfig.plugins ?? []),
    ],
  });

  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({});

  const { ViteNodeRunner } = await import('vite-node/client');
  const { ViteNodeServer } = await import('vite-node/server');

  const node = new ViteNodeServer(server);

  class ViteNodeRunnerWithContext extends ViteNodeRunner {
    cssAdapter: Adapter | undefined;

    prepareContext(context: Record<string, any>): Record<string, any> {
      return {
        ...super.prepareContext(context),
        [globalAdapterIdentifier]: this.cssAdapter,
      };
    }
  }

  const runner = new ViteNodeRunnerWithContext({
    root,
    base: server.config.base,
    fetchModule(id) {
      return node.fetchModule(id);
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer);
    },
  });

  if (enableFileWatcher) {
    server.watcher.on('change', (filePath) => {
      runner.moduleCache.invalidateDepTree([filePath]);
    });
  }

  return {
    server,
    runner,
  };
};

class NormalizedMap<V> extends Map<string, V> {
  constructor(readonly root: string) {
    super();
  }

  #normalizePath(filePath: string) {
    return normalizePath(
      isAbsolute(filePath) ? filePath : join(this.root, filePath),
    );
  }

  get(filePath: string) {
    filePath = this.#normalizePath(filePath);
    return super.get(filePath);
  }

  set(filePath: string, value: V) {
    filePath = this.#normalizePath(filePath);
    return super.set(filePath, value);
  }
}

export interface Compiler {
  processVanillaFile(
    filePath: string,
    options?: {
      outputCss?: boolean;
    },
  ): Promise<{ source: string; watchFiles: Set<string> }>;
  invalidateAllModules(): Promise<void>;
  getCssForFile(virtualCssFilePath: string): { filePath: string; css: string };
  close(): Promise<void>;
  getAllCss(): string;
}

interface ProcessedVanillaFile {
  source: string;
  watchFiles: Set<string>;
}

export interface CreateCompilerOptions {
  root: string;
  /**
   * By default, the compiler sets up its own file watcher. This option allows you to disable it if
   * necessary, such as during a production build.
   *
   * @default true
   */
  enableFileWatcher?: boolean;
  cssImportSpecifier?: (
    filePath: string,
    css: string,
  ) => string | Promise<string>;
  /**
   * When true, generates one CSS import per rule instead of one per file.
   * This can help bundlers like Turbopack deduplicate shared CSS more effectively.
   *
   * @default false
   */
  splitCssPerRule?: boolean;
  identifiers?: IdentifierOption;
  viteConfig?: ViteUserConfig;
  /** @deprecated */
  viteResolve?: ViteUserConfig['resolve'];
  /** @deprecated */
  vitePlugins?: ViteUserConfig['plugins'];
}
export const createCompiler = ({
  root,
  identifiers = 'debug',
  cssImportSpecifier = (filePath) => filePath + '.vanilla.css',
  splitCssPerRule = false,
  viteConfig,
  enableFileWatcher,
  viteResolve,
  vitePlugins,
}: CreateCompilerOptions): Compiler => {
  assert(
    !(viteConfig && (viteResolve || vitePlugins)),
    'viteConfig cannot be used with viteResolve or vitePlugins',
  );

  const vitePromise = createViteServer({
    root,
    identifiers,
    viteConfig: viteConfig ?? {
      resolve: viteResolve,
      plugins: vitePlugins,
    },
    enableFileWatcher,
  });

  const processVanillaFileCache = new Map<
    string,
    {
      lastInvalidationTimestamp: number;
      result: ProcessedVanillaFile;
    }
  >();

  const cssCache = new NormalizedMap<{ css: string; cssRules: string[] }>(root);
  const classRegistrationsByModuleId = new NormalizedMap<{
    localClassNames: Set<string>;
    composedClassLists: Array<Composition>;
  }>(root);

  return {
    async processVanillaFile(
      filePath,
      options = {},
    ): Promise<ProcessedVanillaFile> {
      const { server, runner } = await vitePromise;

      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);
      const outputCss = options.outputCss ?? true;

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

      const cssByModuleId = new NormalizedMap<Array<Css>>(root);
      const localClassNames = new Set<string>();
      const composedClassLists: Array<Composition> = [];

      const cssAdapter: Adapter = {
        getIdentOption: () => identifiers,
        onBeginFileScope: (fileScope) => {
          // Before evaluating a file, reset the cache for it
          const moduleId = normalizePath(fileScope.filePath);
          cssByModuleId.set(moduleId, []);
          classRegistrationsByModuleId.set(moduleId, {
            localClassNames: new Set(),
            composedClassLists: [],
          });
        },
        onEndFileScope: (fileScope) => {
          // For backwards compatibility, ensure the cache is populated even if
          // a file didn't contain any CSS. This is to ensure that the only
          // error messages shown in older versions are the ones below.
          const moduleId = normalizePath(fileScope.filePath);
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

          const moduleId = normalizePath(fileScope.filePath);
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

          const moduleId = normalizePath(fileScope.filePath);
          classRegistrationsByModuleId
            .get(moduleId)!
            .composedClassLists.push(composedClassList);
        },
        markCompositionUsed: () => {
          // This compiler currently retains all composition classes
        },
        appendCss: (css, fileScope) => {
          const moduleId = normalizePath(fileScope.filePath);
          const cssObjs = cssByModuleId.get(moduleId) ?? [];
          cssObjs.push(css);

          cssByModuleId.set(moduleId, cssObjs);
        },
      };

      const { fileExports, cssImports, watchFiles, lastInvalidationTimestamp } =
        await lock(async () => {
          runner.cssAdapter = cssAdapter;

          const fileExports = await runner.executeFile(filePath);

          const moduleId = normalizePath(filePath);
          const moduleNode = server.moduleGraph.getModuleById(moduleId);

          if (!moduleNode) {
            throw new Error(`Can't find ModuleNode for ${filePath}`);
          }

          const cssImports: string[] = [];
          const orderedComposedClassLists: Composition[] = [];

          const scanModule = createModuleScanner();
          const { cssDeps, watchFiles } = scanModule(moduleNode);

          for (const cssDep of cssDeps) {
            const cssDepModuleId = normalizePath(cssDep);
            const cssObjs = cssByModuleId.get(cssDepModuleId);
            const cachedCss = cssCache.get(cssDepModuleId);
            const cachedClassRegistrations =
              classRegistrationsByModuleId.get(cssDepModuleId);

            if (cachedClassRegistrations) {
              orderedComposedClassLists.push(
                ...cachedClassRegistrations.composedClassLists,
              );
            }

            if (!cssObjs && !cachedCss && !cachedClassRegistrations) {
              continue;
            }

            if (cssObjs) {
              let cssRules: string[] = [];

              if (cssObjs.length > 0) {
                cssRules = transformCss({
                  localClassNames: Array.from(localClassNames),
                  composedClassLists: orderedComposedClassLists,
                  cssObjs,
                });
              }

              cssCache.set(cssDepModuleId, {
                css: cssRules.join('\n'),
                cssRules,
              });
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

            const { css = '', cssRules = [] } =
              cssCache.get(cssDepModuleId) ?? {};

            if (cssObjs || css) {
              if (splitCssPerRule) {
                const importSpecifiers = await Promise.all(
                  cssRules.map((rule, i) =>
                    cssImportSpecifier(cssDepModuleId + `#${i}`, rule),
                  ),
                );
                for (const specifier of importSpecifiers) {
                  cssImports.push(`import '${specifier}';`);
                }
              } else {
                const specifier = await cssImportSpecifier(cssDepModuleId, css);
                cssImports.push(`import '${specifier}';`);
              }
            }
          }

          return {
            fileExports,
            cssImports: outputCss ? cssImports : [],
            watchFiles,
            lastInvalidationTimestamp: moduleNode.lastInvalidationTimestamp,
          };
        });

      const result: ProcessedVanillaFile = {
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
    async invalidateAllModules() {
      const { server, runner } = await vitePromise;

      for (const [key] of runner.moduleCache.entries()) {
        if (!key.includes('node_modules')) {
          runner.moduleCache.delete(key);
        }
      }

      for (const [id, moduleNode] of server.moduleGraph.idToModuleMap) {
        if (!id.includes('node_modules')) {
          server.moduleGraph.invalidateModule(moduleNode);
        }
      }
    },
    getCssForFile(filePath: string) {
      filePath = isAbsolute(filePath) ? filePath : join(root, filePath);
      const moduleId = normalizePath(filePath);
      const result = cssCache.get(moduleId);

      if (!result) {
        throw new Error(`No CSS for file: ${filePath}`);
      }

      return {
        css: result.css,
        filePath: filePath,
        resolveDir: root,
      };
    },
    async close() {
      const { server } = await vitePromise;

      await server.close();
    },
    getAllCss() {
      let allCss = '';

      for (const { css } of cssCache.values()) {
        if (css) {
          allCss += css + '\n';
        }
      }

      return allCss;
    },
  };
};
