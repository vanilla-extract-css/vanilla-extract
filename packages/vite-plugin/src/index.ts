import path from 'path';

import type { Plugin, ResolvedConfig, ViteDevServer, Rollup } from 'vite';
import {
  cssFileFilter,
  IdentifierOption,
  getPackageInfo,
  transform,
  type Compiler,
  createCompiler,
  normalizePath,
} from '@vanilla-extract/integration';

const virtualExtCss = '.vanilla.css';

const isVirtualId = (id: string) => id.endsWith(virtualExtCss);
const fileIdToVirtualId = (id: string) => `${id}${virtualExtCss}`;
const virtualIdToFileId = (virtualId: string) =>
  virtualId.slice(0, -virtualExtCss.length);

interface Options {
  identifiers?: IdentifierOption;
  unstable_mode?: 'transform' | 'emitCss';
}
export function vanillaExtractPlugin({
  identifiers,
  unstable_mode: mode = 'emitCss',
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;

  const getIdentOption = () =>
    identifiers ?? (config.mode === 'production' ? 'short' : 'debug');
  const getAbsoluteId = (filePath: string) => {
    let resolvedId = filePath;

    if (
      filePath.startsWith(config.root) ||
      // In monorepos the absolute path will be outside of config.root, so we check that they have the same root on the file system
      (path.isAbsolute(filePath) &&
        filePath.split(path.sep)[1] === config.root.split(path.sep)[1])
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
    const modules = Array.from(moduleGraph.getModulesByFile(absoluteId) || []);

    for (const module of modules) {
      moduleGraph.invalidateModule(module);

      // Vite uses this timestamp to add `?t=` query string automatically for HMR.
      module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now();
    }
  }

  function addWatchFiles(
    this: Rollup.PluginContext,
    fromId: string,
    files: Set<string>,
  ) {
    // We don't need to watch files in build mode
    if (config.command === 'build' && !config.build.watch) {
      return;
    }

    const filesToWatch = [...files].filter(
      (file) => !file.includes('node_modules'),
    );

    for (const file of filesToWatch) {
      if (normalizePath(file) !== fromId) {
        this.addWatchFile(file);
      }
    }
  }

  return {
    name: 'vanilla-extract',
    configureServer(_server) {
      server = _server;
    },
    config() {
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
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
      packageName = getPackageInfo(config.root).name;

      if (mode !== 'transform') {
        compiler = createCompiler({
          root: config.root,
          identifiers: getIdentOption(),
          cssImportSpecifier: fileIdToVirtualId,
          vitePlugins: config.inlineConfig.plugins
            ?.flat()
            // Prevent an infinite loop where the compiler creates a new instance of the plugin, which creates a new compiler etc.
            .filter(
              (plugin) =>
                typeof plugin === 'object' &&
                plugin !== null &&
                'name' in plugin &&
                plugin.name !== 'vanilla-extract',
            ),
        });
      }
    },
    buildEnd() {
      compiler?.close();
    },
    async transform(code, id) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      const identOption = getIdentOption();

      if (mode === 'transform') {
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

        addWatchFiles.call(this, absoluteId, watchFiles);

        // We have to invalidate the virtual module, not the real one we just transformed
        invalidateModule(fileIdToVirtualId(absoluteId));

        return {
          code: source,
          map: { mappings: '' },
        };
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
