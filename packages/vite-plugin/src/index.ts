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
import { type Compiler, createCompiler } from '@vanilla-extract/compiler';
import {
  cssFileFilter,
  DEFAULT_FILE_EXTENSIONS,
  type IdentifierOption,
  getPackageInfo,
  transform,
  normalizePath,
} from '@vanilla-extract/integration';
import { getAbsoluteId } from './ids';

export { DEFAULT_FILE_EXTENSIONS };

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
   * Custom file extension(s) for vanilla-extract files. When specified, only
   * files ending with these exact extensions will be processed instead of the
   * default `.css.ts`, `.css.tsx`, etc.
   *
   * Unlike the default behavior which matches `.css.(ts|tsx|js|jsx|mjs|cjs)`,
   * this option requires you to specify each exact extension you want to match.
   *
   * @example
   * // Process only .ve.ts and .ve.tsx files
   * vanillaExtractPlugin({ fileExtension: ['.ve.ts', '.ve.tsx'] })
   *
   * @example
   * // Process only .styles.ts files
   * vanillaExtractPlugin({ fileExtension: '.styles.ts' })
   *
   * @example
   * // Add custom extensions while keeping the defaults
   * import { DEFAULT_FILE_EXTENSIONS } from '@vanilla-extract/vite-plugin';
   * vanillaExtractPlugin({ fileExtension: [...DEFAULT_FILE_EXTENSIONS, '.ve.ts'] })
   */
  fileExtension?: string | string[];
}

/**
 * Creates a RegExp that matches files ending with the specified exact extension(s).
 *
 * @example
 * createFileExtensionFilter('.ve.ts') // matches: foo.ve.ts
 * createFileExtensionFilter(['.ve.ts', '.ve.tsx']) // matches: foo.ve.ts, bar.ve.tsx
 */
function createFileExtensionFilter(fileExtension: string | string[]): RegExp {
  const extensions = Array.isArray(fileExtension)
    ? fileExtension
    : [fileExtension];

  // Empty array means match nothing
  if (extensions.length === 0) {
    return /(?!)/; // Regex that never matches
  }

  // Escape special regex characters and normalize extensions (ensure leading dot)
  const escapedExtensions = extensions.map((ext) => {
    const normalizedExt = ext.startsWith('.') ? ext : `.${ext}`;
    return normalizedExt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  // Build pattern that matches exact extensions with optional ?used suffix (Vite adds this)
  // e.g., (\.ve\.ts|\.ve\.tsx)(\?used)?$
  const extensionPattern = escapedExtensions.join('|');
  return new RegExp(`(${extensionPattern})(\\?used)?$`);
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
  fileExtension,
}: Options = {}): Plugin[] {
  // Create file filter based on fileExtension option or use default
  const veFileFilter = fileExtension
    ? createFileExtensionFilter(fileExtension)
    : cssFileFilter;

  let config: ResolvedConfig;
  let configEnv: ConfigEnv;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;
  let compilerReady: Promise<void> | undefined;
  let isBuild: boolean;
  const vitePromise = import('vite');

  const transformedModules = new Set<string>();

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
      if (mod.id && veFileFilter.test(mod.id)) {
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
      fileFilter: veFileFilter,
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
        // Ensure we re-use the compiler instance between builds, e.g. in watch mode
        await ensureCompiler();
      },
      buildEnd() {
        // When using the rollup watcher, we don't want to close the compiler after every build.
        // Instead, we close it when the watcher is closed via the closeWatcher hook.
        if (!config.build.watch) {
          compiler?.close();
        }
      },
      closeWatcher() {
        return compiler?.close();
      },
      async transform(code, id, options) {
        const [validId] = id.split('?');

        if (!veFileFilter.test(validId)) {
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
      resolveId(source) {
        const [validId, query] = source.split('?');

        if (!isVirtualId(validId)) return;

        const absoluteId = getAbsoluteId({
          filePath: validId,
          root: config.root,
        });

        if (!compiler) return;

        // The only valid scenario for a missing CSS entry is if someone had
        // written a file in their app using the .vanilla.js/.vanilla.css
        // extension, or the file produced no CSS output.
        const { css } = compiler.getCssForFile(virtualIdToFileId(absoluteId));

        if (css) {
          // Keep the original query string for HMR.
          return absoluteId + (query ? `?${query}` : '');
        }
      },
      load(id) {
        const [validId] = id.split('?');

        if (!isVirtualId(validId) || !compiler) return;

        const absoluteId = getAbsoluteId({
          filePath: validId,
          root: config.root,
        });

        const { css } = compiler.getCssForFile(virtualIdToFileId(absoluteId));

        if (css) {
          return css;
        }
      },
    },
  ];
}
