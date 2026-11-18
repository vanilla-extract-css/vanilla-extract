import type {
  Plugin,
  ResolvedConfig,
  ConfigEnv,
  PluginOption,
  TransformResult,
  UserConfig,
  ModuleNode,
  ViteDevServer,
} from 'vite';
import { posix } from 'path';
import { type Compiler, createCompiler } from '@vanilla-extract/compiler';
import {
  cssFileFilter,
  type IdentifierOption,
  getPackageInfo,
  transform,
  normalizePath,
} from '@vanilla-extract/integration';
import { getAbsoluteId } from './ids';
import { generateCssBundle, stripSideEffectImportsMatching } from './lib';

const PLUGIN_NAMESPACE = 'vite-plugin-vanilla-extract';
const virtualExtCss = '.vanilla.css';

const isVirtualId = (id: string) => id.endsWith(virtualExtCss);
const fileIdToVirtualId = (id: string) => `${id}${virtualExtCss}`;
const virtualIdToFileId = (virtualId: string) =>
  virtualId.slice(0, -virtualExtCss.length);

const isPluginObject = (plugin: PluginOption): plugin is Plugin =>
  typeof plugin === 'object' && plugin !== null && 'name' in plugin;

type PluginFilter = (filterProps: {
  /** The name of the plugin */
  name: string;
  /**
   * The `mode` vite is running in.
   * @see https://vite.dev/guide/env-and-mode.html#modes
   */
  mode: string;
}) => boolean;

interface Options {
  identifiers?: IdentifierOption;
  unstable_pluginFilter?: PluginFilter;
  unstable_mode?: 'transform' | 'emitCss' | 'inlineCssInDev';
  /**
   * Controls how compiled CSS is emitted when building, mirroring the `extract`
   * option of the Rollup plugin.
   *
   * - `undefined` (default): CSS is handled by Vite's native CSS pipeline,
   *   e.g. bundled into a single `.css` file per entry in library mode.
   * - `false`: Each `.css.ts` file is emitted as its own CSS asset (e.g.
   *   `assets/button.css.ts.vanilla.css`) and JS files keep side-effect
   *   imports of those assets.
   * - `{ name?, sourcemap? }`: All CSS is combined into a single asset emitted
   *   by the plugin, and side-effect CSS imports are stripped from JS output.
   *
   * Only applies when building, and has no effect when
   * `unstable_mode: 'transform'` is set.
   *
   * @default undefined
   */
  extract?:
    | {
        /**
         * Name of emitted .css file.
         * @default "bundle.css"
         */
        name?: string;
        /**
         * Generate a .css.map file?
         * @default false
         */
        sourcemap?: boolean;
      }
    | false;
}

// Plugins that we know are compatible with the `vite-node` compiler
// and don't need to be filtered out.
const COMPATIBLE_PLUGINS = ['vite-tsconfig-paths'];

const defaultPluginFilter: PluginFilter = ({ name }) =>
  COMPATIBLE_PLUGINS.includes(name);

const withUserPluginFilter =
  ({ mode, pluginFilter }: { mode: string; pluginFilter: PluginFilter }) =>
  (plugin: Plugin) =>
    pluginFilter({ name: plugin.name, mode });

export function vanillaExtractPlugin({
  identifiers,
  unstable_pluginFilter: pluginFilter = defaultPluginFilter,
  unstable_mode = 'emitCss',
  extract,
}: Options = {}): Plugin[] {
  let config: ResolvedConfig;
  let configEnv: ConfigEnv;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;
  let compilerReady: Promise<void> | undefined;
  let isBuild: boolean;
  const vitePromise = import('vite');

  const transformedModules = new Set<string>();

  // Only used when `extract: { ... }` is configured
  let extractedCssIds = new Set<string>();
  // Only used when `extract: false` is configured; module id -> asset id
  const emittedCssAssets = new Map<string, string>();

  const extractApplies = () =>
    config.command === 'build' &&
    extract !== undefined &&
    unstable_mode !== 'transform';

  const getIdentOption = () =>
    identifiers ?? (config.mode === 'production' ? 'short' : 'debug');

  /**
   * Custom invalidation function that takes a chain of importers to invalidate. If an importer is a
   * VE module, its virtual CSS is invalidated instead. Otherwise, the module is invalidated
   * normally.
   */
  const invalidateImporterChain = ({
    importerChain,
    server,
    timestamp,
  }: {
    importerChain: Set<ModuleNode>;
    server: ViteDevServer;
    timestamp: number;
  }) => {
    const { moduleGraph } = server;

    const seen = new Set<ModuleNode>();

    for (const mod of importerChain) {
      if (mod.id && cssFileFilter.test(mod.id)) {
        const virtualModules = moduleGraph.getModulesByFile(
          fileIdToVirtualId(mod.id),
        );

        for (const virtualModule of virtualModules ?? []) {
          moduleGraph.invalidateModule(virtualModule, seen, timestamp, true);
        }
      } else if (mod.id) {
        // `mod` is from the compiler's internal Vite server, so look up the
        // corresponding module in the consuming server's graph by ID
        const serverMod = moduleGraph.getModuleById(mod.id);
        if (serverMod) {
          moduleGraph.invalidateModule(serverMod, seen, timestamp, true);
        }
      }
    }
  };

  const initializeCompiler = async () => {
    const { loadConfigFromFile } = await vitePromise;

    let configForViteCompiler: UserConfig | undefined;

    // The user has a vite config file
    if (config.configFile) {
      const configFile = await loadConfigFromFile(
        {
          command: config.command,
          mode: config.mode,
          isSsrBuild: configEnv.isSsrBuild,
        },
        config.configFile,
      );

      configForViteCompiler = configFile?.config;
    }
    // The user is using a vite-based framework that has a custom config file
    else {
      configForViteCompiler = config.inlineConfig;
    }

    const viteConfig = {
      ...configForViteCompiler,
      plugins: configForViteCompiler?.plugins
        ?.flat()
        .filter(isPluginObject)
        .filter(withUserPluginFilter({ mode: config.mode, pluginFilter })),
    };

    compiler = createCompiler({
      root: config.root,
      identifiers: getIdentOption(),
      cssImportSpecifier: fileIdToVirtualId,
      viteConfig,
      enableFileWatcher: !isBuild,
    });
  };

  /**
   * Lazily creates the compiler, memoizing the initialization promise.
   *
   * `buildStart` kicks this off eagerly, but `transform` also awaits it. This
   * matters because `transform` can run before `buildStart` has finished
   * creating the compiler when another plugin emits an additional entry whose
   * module graph is transformed concurrently (e.g. a module federation plugin
   * exposing a module as its own chunk). Without awaiting, `transform` would
   * bail and leave the `.css.ts` untransformed, producing runtime `style()`
   * calls that throw "Styles were unable to be assigned to a file".
   */
  const ensureCompiler = () => {
    if (unstable_mode === 'transform') {
      return Promise.resolve();
    }

    compilerReady ??= initializeCompiler();
    return compilerReady;
  };

  /**
   * Virtual `*.vanilla.css` modules are only populated after the parent
   * `.css.ts` has been `processVanillaFile`'d. That normally happens in
   * `transform`, but Vite can serve the parent without re-running `transform`
   * (notably 304 Not Modified after a server restart with a warm browser
   * cache), leaving the compiler CSS cache empty when the virtual module is
   * requested. On miss, process the parent so virtual CSS is self-sufficient.
   *
   * A future (likely breaking) refactor should consider a soft-read/ensure API
   * in the compiler so plugins don't have to catch thrown cache misses or call
   * `processVanillaFile` themselves.
   */
  const ensureCssForVirtualId = async (absoluteVirtualId: string) => {
    await ensureCompiler();

    if (!compiler) {
      return null;
    }

    const fileId = virtualIdToFileId(absoluteVirtualId);

    try {
      return compiler.getCssForFile(fileId).css;
    } catch {
      // Not in cache yet for this compiler lifetime
    }

    await compiler.processVanillaFile(fileId, { outputCss: true });

    try {
      return compiler.getCssForFile(fileId).css;
    } catch {
      return null;
    }
  };

  return [
    {
      name: `${PLUGIN_NAMESPACE}-inline-dev-css`,
      apply: (_, { command }) =>
        command === 'serve' && unstable_mode === 'inlineCssInDev',
      transformIndexHtml: async () => {
        const allCss = compiler?.getAllCss();

        if (!allCss) {
          return [];
        }

        return [
          {
            tag: 'style',
            children: allCss,
            attrs: {
              type: 'text/css',
              'data-vanilla-extract-inline-dev-css': true,
            },
            injectTo: 'head-prepend',
          },
        ];
      },
    },
    {
      name: PLUGIN_NAMESPACE,
      configureServer(_server) {
        server = _server;

        server.watcher.on('unlink', (file) => {
          transformedModules.delete(normalizePath(file));
        });
      },
      config(_userConfig, _configEnv) {
        configEnv = _configEnv;
        return {
          ssr: {
            external: [
              '@vanilla-extract/css',
              '@vanilla-extract/css/fileScope',
              '@vanilla-extract/css/adapter',
            ],
          },
        };
      },
      configResolved(_resolvedConfig) {
        config = _resolvedConfig;
        isBuild = config.command === 'build' && !config.build.watch;
        packageName = getPackageInfo(config.root).name;
      },
      async buildStart() {
        // Reset extract state between builds, e.g. in watch mode
        extractedCssIds = new Set();
        emittedCssAssets.clear();

        // Ensure we re-use the compiler instance between builds, e.g. in watch mode
        await ensureCompiler();
      },
      buildEnd() {
        // Generate CSS bundle (if extracting)
        if (extract && extractApplies()) {
          // Note: this can't happen earlier than buildEnd because the module
          // graph isn't complete until this point
          const { bundle, extractedCssIds: extractedIds } =
            generateCssBundle(this);
          extractedCssIds = extractedIds;

          const name = extract.name || 'bundle.css';
          this.emitFile({
            type: 'asset',
            name,
            originalFileName: name,
            source: bundle.toString(),
          });

          if (extract.sourcemap) {
            const sourcemapName = `${name}.map`;
            this.emitFile({
              type: 'asset',
              name: sourcemapName,
              originalFileName: sourcemapName,
              source: bundle
                .generateMap({ file: name, includeContent: true })
                .toString(),
            });
          }
        }

        // When using the rollup watcher, we don't want to close the compiler after every build.
        // Instead, we close it when the watcher is closed via the closeWatcher hook.
        if (!config.build.watch) {
          compiler?.close();
        }
      },
      // Emit per-file CSS assets and replace CSS import paths with relative
      // paths to the emitted files (only for `extract: false`)
      renderChunk(code, chunkInfo) {
        if (extract !== false || !extractApplies()) {
          return null;
        }

        const chunkPath = posix.dirname(chunkInfo.fileName);
        let output = code;

        // Process longest specifiers first so a specifier that is a substring
        // of another (e.g. nested paths sharing a suffix) can't be corrupted
        // by an earlier replacement
        const cssImportPaths = [...chunkInfo.imports].sort(
          (pathA, pathB) => pathB.length - pathA.length,
        );

        for (const importPath of cssImportPaths) {
          const moduleInfo = this.getModuleInfo(importPath);

          if (!moduleInfo) {
            continue;
          }

          const css = moduleInfo.meta.css;

          if (typeof css !== 'string') {
            continue;
          }

          let assetId = emittedCssAssets.get(importPath);

          if (!assetId) {
            assetId = this.emitFile({
              type: 'asset',
              name: posix.basename(moduleInfo.id),
              originalFileName: moduleInfo.id,
              source: css,
            });
            emittedCssAssets.set(importPath, assetId);
          }

          const assetPath = this.getFileName(assetId);
          const relativeAssetPath = `./${posix.normalize(
            posix.relative(chunkPath, assetPath),
          )}`;

          output = output.replace(importPath, relativeAssetPath);
        }

        if (output === code) {
          return null;
        }

        return {
          code: output,
          map: null,
        };
      },
      // Remove side effect CSS imports (only for `extract: { ... }`)
      generateBundle(_options, bundle) {
        if (!extract || !extractApplies()) {
          return;
        }

        for (const chunk of Object.values(bundle)) {
          const isJsFile = /\.(m|c)?js$/.test(chunk.fileName);
          if (
            chunk.type === 'chunk' &&
            isJsFile &&
            chunk.imports.some((specifier) => extractedCssIds.has(specifier))
          ) {
            chunk.code = stripSideEffectImportsMatching(chunk.code, [
              ...extractedCssIds,
            ]);
          }
        }
      },
      closeWatcher() {
        return compiler?.close();
      },
      async transform(code, id, options) {
        const [validId] = id.split('?');

        if (!cssFileFilter.test(validId)) {
          return null;
        }

        const identOption = getIdentOption();
        const normalizedId = normalizePath(validId);

        if (unstable_mode === 'transform') {
          transformedModules.add(normalizedId);

          return transform({
            source: code,
            filePath: normalizedId,
            rootPath: config.root,
            packageName,
            identOption,
          });
        }

        // `transform` can run before `buildStart` has finished creating the
        // compiler (e.g. when another plugin emits an additional entry whose
        // module graph is transformed concurrently). Await the memoized
        // initialization rather than bailing, which would leave this `.css.ts`
        // untransformed. `ensureCompiler` is memoized, so this is a no-op once
        // the compiler exists.
        await ensureCompiler();

        if (!compiler) {
          return null;
        }

        const absoluteId = getAbsoluteId({
          filePath: validId,
          root: config.root,
        });

        const { source, watchFiles } = await compiler.processVanillaFile(
          absoluteId,
          { outputCss: true },
        );

        transformedModules.add(normalizedId);

        const result: TransformResult = {
          code: source,
          map: { mappings: '' },
        };

        // We don't need to watch files or invalidate modules in build mode or during SSR
        if (isBuild || options?.ssr) {
          return result;
        }

        for (const file of watchFiles) {
          if (
            !file.includes('node_modules') &&
            normalizePath(file) !== absoluteId
          ) {
            this.addWatchFile(file);
          }
        }

        return result;
      },
      // The compiler's module graph is always a subset of the consuming Vite dev server's module
      // graph, so this early exit will be hit for any modules that aren't related to VE modules.
      async handleHotUpdate({ file, server, timestamp }) {
        if (!compiler) {
          return;
        }

        const importerChain = await compiler.findImporterTree(
          normalizePath(file),
          transformedModules,
        );

        if (importerChain.size === 0) {
          return;
        }

        invalidateImporterChain({
          importerChain,
          server,
          timestamp,
        });
      },
      async resolveId(source) {
        const [validId, query] = source.split('?');

        if (!isVirtualId(validId)) return;

        const absoluteId = getAbsoluteId({
          filePath: validId,
          root: config.root,
        });

        const css = await ensureCssForVirtualId(absoluteId);

        if (css) {
          if (extractApplies()) {
            // Hand CSS emission over to the plugin's extract machinery. The
            // virtual CSS module is marked external so Vite's CSS pipeline
            // never bundles it; renderChunk/buildEnd/generateBundle take over.
            return {
              id: absoluteId,
              external: true,
              meta: { css },
            };
          }

          // Keep the original query string for HMR.
          return absoluteId + (query ? `?${query}` : '');
        }
      },
      async load(id) {
        const [validId] = id.split('?');

        if (!isVirtualId(validId)) return;

        const absoluteId = getAbsoluteId({
          filePath: validId,
          root: config.root,
        });

        const css = await ensureCssForVirtualId(absoluteId);

        if (css) {
          return css;
        }
      },
    },
  ];
}
