import { join, relative, isAbsolute } from 'path';
import assert from 'assert';
import type { Adapter } from '@vanilla-extract/css';
import { transformCss } from '@vanilla-extract/css/transformCss';
import type { ModuleNode, Plugin as VitePlugin, ViteDevServer } from 'vite';
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

interface ProcessedVanillaFile {
  source: string;
  watchFiles: Set<string>;
}

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

export interface InlineCompilerOptions {
  root: string;
  identifiers?: IdentifierOption;
  vitePlugins?: Array<VitePlugin>;
}

export class InlineCompiler {
  root: string;
  identifiers: IdentifierOption;
  transformCache: Map<string, { buildtime: string; runtime: string }>;
  runner: ViteNodeRunner | undefined;
  server: ViteDevServer | undefined;
  originalPrepareContext: ViteNodeRunner['prepareContext'] | undefined;
  viteInitPromise: Promise<void>;
  cssCache: Map<string, { css: string }>;
  processVanillaFileCache: Map<
    string,
    {
      lastInvalidationTimestamp: number;
      result: ProcessedVanillaFile;
    }
  >;
  classRegistrationsByModuleId: Map<
    string,
    {
      localClassNames: Set<string>;
      composedClassLists: Array<Composition>;
    }
  >;

  constructor({
    root,
    identifiers = 'debug',
    vitePlugins = [],
  }: InlineCompilerOptions) {
    this.root = root;
    this.identifiers = identifiers;
    this.transformCache = new Map();
    this.viteInitPromise = this.intializeViteNode(vitePlugins);
    this.cssCache = new Map();
    this.processVanillaFileCache = new Map();
    this.classRegistrationsByModuleId = new Map();
  }

  async resolve(specifier: string, importee: string) {
    if (!this.runner) {
      throw new Error('Attempted to resolve without intializing Vite Node');
    }

    const [, filePath] = await this.runner.resolveUrl(specifier, importee);

    return filePath;
  }

  async transformCode(code: string, id: string) {
    let macros: Array<string> = ['css$'];

    if (!cssFileFilter.test(id)) {
      const relevantImports = findStaticImports(code)
        .map((rawImport) => {
          const { namedImports, specifier } = parseStaticImport(rawImport);

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
              throw new Error(`Can't resolve "${specifier}" from "${id}"`);
            }

            const { config } = getPackageInfo(resolved);
            importMacros = config.macros || [];
          }

          return importMacros
            .map((macro) => namedImports![macro])
            .filter(Boolean);
        }),
      );

      macros = result.flat();
    }

    const transformResult = await transform({
      source: code,
      rootPath: this.root,
      filePath: id,
      // TODO: Do we need this anymore after file scope change?
      packageName: getPackageInfo(this.root).name,
      identOption: this.identifiers,
      globalAdapterIdentifier,
      macros,
    });

    this.transformCache.set(id, transformResult);

    return transformResult.buildtime;
  }

  async intializeViteNode(vitePlugins: Array<VitePlugin>) {
    assert(
      !this.viteInitPromise,
      'Attempted to intialize Vite Node multiple times',
    );

    const vite = await import('vite');

    normalizeModuleId = vite.normalizePath;

    const transform = (code: string, id: string) =>
      this.transformCode(code, id);

    const server = await vite.createServer({
      root: this.root,
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
            return transform(code, id);
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
      root: this.root,
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

    // Store the original method so we can monkey patch it on demand
    this.originalPrepareContext = runner.prepareContext;

    this.server = server;
    this.runner = runner;
  }

  async processVanillaFile(
    filePath: string,
    {
      outputCss = true,
      cssImportSpecifier = (filePath: string) => filePath + '.vanilla.css',
    }: {
      outputCss?: boolean;
      cssImportSpecifier?: (
        filePath: string,
        css: string,
        root: string,
      ) => Promise<string> | string;
    } = {},
  ): Promise<ProcessedVanillaFile | null> {
    await this.viteInitPromise;
    assert(this.server && this.runner, 'Vite Node not intialized correctly');

    filePath = isAbsolute(filePath) ? filePath : join(this.root, filePath);

    const cacheKey = Object.entries({ filePath, outputCss })
      .map((entry) => entry.join('='))
      .join('|');
    const cachedFile = this.processVanillaFileCache.get(cacheKey);
    if (cachedFile) {
      const moduleNode = this.server.moduleGraph.getModuleById(filePath);
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
      getIdentOption: () => this.identifiers,
      onBeginFileScope: (fileScope) => {
        // Before evaluating a file, reset the cache for it
        const moduleId = normalizeModuleId(fileScope.filePath);
        cssByModuleId.set(moduleId, []);
        this.classRegistrationsByModuleId.set(moduleId, {
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
        this.classRegistrationsByModuleId
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
        this.classRegistrationsByModuleId
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

    const originalPrepareContext = this.originalPrepareContext!;

    const { fileExports, cssImports, watchFiles, lastInvalidationTimestamp } =
      await lock(async () => {
        assert(
          this.server && this.runner,
          'Vite Node not intialized correctly',
        );

        // Monkey patch the prepareContext method to inject the adapter
        this.runner!.prepareContext = function (...args) {
          return {
            ...originalPrepareContext.apply(this, args),
            [globalAdapterIdentifier]: cssAdapter,
          };
        };

        // console.log('Execute file', filePath);
        const fileExports = await this.runner.executeFile(filePath);

        const moduleId = normalizeModuleId(filePath);
        const moduleNode = this.server.moduleGraph.getModuleById(moduleId);

        if (!moduleNode) {
          throw new Error(`Can't find ModuleNode for ${filePath}`);
        }

        const cssImports = [];

        const { cssDeps, watchFiles } = scanModule(moduleNode, this.root);

        for (const cssDep of cssDeps) {
          const cssDepModuleId = normalizeModuleId(cssDep);
          const cssObjs = cssByModuleId.get(cssDepModuleId);
          const cachedCss = this.cssCache.get(cssDepModuleId);
          const cachedClassRegistrations =
            this.classRegistrationsByModuleId.get(cssDepModuleId);

          if (!cssObjs && !cachedCss && !cachedClassRegistrations) {
            continue;
          }

          if (cssObjs) {
            const css = transformCss({
              localClassNames: Array.from(localClassNames),
              composedClassLists,
              cssObjs,
            }).join('\n');

            this.cssCache.set(cssDepModuleId, { css });
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
                this.cssCache.get(cssDepModuleId)?.css!,
                this.root,
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

    const runtimeCode = this.transformCache.get(filePath)?.runtime;

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

    this.processVanillaFileCache.set(cacheKey, {
      lastInvalidationTimestamp,
      result,
    });

    return result;
  }

  getCssForFile(filePath: string) {
    assert(
      normalizeModuleId,
      `Compiler is still loading. No CSS for file: ${filePath}`,
    );

    filePath = isAbsolute(filePath) ? filePath : join(this.root, filePath);
    const rootRelativePath = relative(this.root, filePath);

    const moduleId = normalizeModuleId(rootRelativePath);
    const result = this.cssCache.get(moduleId);

    if (!result) {
      throw new Error(`No CSS for file: ${filePath}`);
    }

    return {
      css: result.css,
      filePath: rootRelativePath,
      resolveDir: this.root,
    };
  }

  async close() {
    await this.viteInitPromise;

    await this.server!.close();
  }
}
