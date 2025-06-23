import path from 'path';

import type {
  Plugin,
  ResolvedConfig,
  ConfigEnv,
  ViteDevServer,
  PluginOption,
  TransformResult,
  UserConfig,
} from 'vite';
import { type Compiler, createCompiler } from '@vanilla-extract/compiler';
import {
  cssFileFilter,
  type IdentifierOption,
  getPackageInfo,
  transform,
  normalizePath,
} from '@vanilla-extract/integration';

const PLUGIN_NAME = 'vite-plugin-vanilla-extract';
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
  unstable_mode?: 'transform' | 'emitCss';
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
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let configEnv: ConfigEnv;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;
  let isBuild: boolean;
  const vitePromise = import('vite');

  const getIdentOption = () =>
    identifiers ?? (config.mode === 'production' ? 'short' : 'debug');
  const getAbsoluteId = (filePath: string) => {
    let resolvedId = filePath;

    if (
      filePath.startsWith(config.root) ||
      // In monorepos the absolute path will be outside of config.root, so we check that they have the same root on the file system
      // Paths from vite are always normalized, so we have to use the posix path separator
      (path.isAbsolute(filePath) &&
        filePath.split(path.posix.sep)[1] ===
          config.root.split(path.posix.sep)[1])
    ) {
      resolvedId = filePath;
    } else {
      // In SSR mode we can have paths like /app/styles.css.ts
      resolvedId = path.join(config.root, filePath);
    }

    return normalizePath(resolvedId);
  };

  function invalidateModule(absoluteId: string) {
    if (!server) return;

    const { moduleGraph } = server;
    const modules = moduleGraph.getModulesByFile(absoluteId);

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module);

        // Vite uses this timestamp to add `?t=` query string automatically for HMR.
        module.lastHMRTimestamp =
          module.lastInvalidationTimestamp || Date.now();
      }
    }
  }

  return {
    name: PLUGIN_NAME,
    configureServer(_server) {
      server = _server;
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
    async configResolved(_resolvedConfig) {
      config = _resolvedConfig;
      isBuild = config.command === 'build' && !config.build.watch;
      packageName = getPackageInfo(config.root).name;
    },
    async buildStart() {
      // Ensure we re-use the compiler instance between builds, e.g. in watch mode
      if (unstable_mode !== 'transform' && !compiler) {
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
      }
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
    async transform(code, id, options = {}) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      const identOption = getIdentOption();

      if (unstable_mode === 'transform') {
        return transform({
          source: code,
          filePath: normalizePath(validId),
          rootPath: config.root,
          packageName,
          identOption,
        });
      }

      if (compiler) {
        const absoluteId = getAbsoluteId(validId);

        const { source, watchFiles } = await compiler.processVanillaFile(
          absoluteId,
          { outputCss: true },
        );
        const result: TransformResult = {
          code: source,
          map: { mappings: '' },
        };

        // We don't need to watch files or invalidate modules in build mode or during SSR
        if (isBuild || options.ssr) {
          return result;
        }

        for (const file of watchFiles) {
          if (
            !file.includes('node_modules') &&
            normalizePath(file) !== absoluteId
          ) {
            this.addWatchFile(file);
          }

          // We have to invalidate the virtual module & deps, not the real one we just transformed
          // The deps have to be invalidated in case one of them changing was the trigger causing
          // the current transformation
          if (cssFileFilter.test(file)) {
            invalidateModule(fileIdToVirtualId(file));
          }
        }

        return result;
      }
    },
    resolveId(source) {
      const [validId, query] = source.split('?');

      if (!isVirtualId(validId)) return;

      const absoluteId = getAbsoluteId(validId);

      if (
        // We should always have CSS for a file here.
        // The only valid scenario for a missing one is if someone had written
        // a file in their app using the .vanilla.js/.vanilla.css extension
        compiler?.getCssForFile(virtualIdToFileId(absoluteId))
      ) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : '');
      }
    },
    load(id) {
      const [validId] = id.split('?');

      if (!isVirtualId(validId) || !compiler) return;

      const absoluteId = getAbsoluteId(validId);

      const { css } = compiler.getCssForFile(virtualIdToFileId(absoluteId));

      return css;
    },
  };
}
