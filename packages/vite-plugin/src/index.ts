import path from 'path';

import type { Plugin, ResolvedConfig, ViteDevServer, Rollup } from 'vite';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  getPackageInfo,
  CompileOptions,
  transform,
  type Compiler,
  createCompiler,
  normalizePath,
} from '@vanilla-extract/integration';

const virtualExtCss = '.vanilla.css';

const fileIdToVirtualId = (id: string) => `${id}${virtualExtCss}`;
const virtualIdToFileId = (virtualId: string) =>
  virtualId.slice(0, -virtualExtCss.length);

interface Options {
  identifiers?: IdentifierOption;
  mode?: 'transform' | 'emitCss';
  emitCssInSsr?: boolean;
  compiler?: 'esbuild';
  esbuildOptions?: CompileOptions['esbuildOptions'];
}
export function vanillaExtractPlugin({
  identifiers,
  mode = 'emitCss',
  emitCssInSsr = true,
  compiler: chosenCompiler,
  esbuildOptions,
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;

  const cssMap = new Map<string, string>();

  const debug = (cb: () => void) => {
    if (config.logLevel === 'info') cb();
  };
  const getIdentOption = () =>
    identifiers ?? (config.mode === 'production' ? 'short' : 'debug');
  const getAbsoluteFileId = (filePath: string) => {
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

    debug(() => console.log(`[invalidate] ${absoluteId}`));
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
    if (!(config.command === 'build' && config.build.watch)) {
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

      if (!chosenCompiler) {
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
    resolveId(source) {
      const [validId, query] = source.split('?');

      if (!validId.endsWith(virtualExtCss)) return;

      const absoluteId = getAbsoluteFileId(validId);

      if (
        compiler?.getCssForFile(virtualIdToFileId(absoluteId)) ||
        // There should always be an entry in the `cssMap` here.
        // The only valid scenario for a missing one is if someone had written
        // a file in their app using the .vanilla.js/.vanilla.css extension
        cssMap.has(absoluteId)
      ) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : '');
      }
    },
    load(id) {
      const [validId] = id.split('?');

      if (!validId.endsWith(virtualExtCss)) return;

      if (compiler) {
        const absoluteId = getAbsoluteFileId(validId);

        const { css } = compiler.getCssForFile(virtualIdToFileId(absoluteId));

        return css;
      }

      const css = cssMap.get(validId);

      return css;
    },
    async transform(code, id, options) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      const outputCss = options?.ssr || options == null ? emitCssInSsr : true;
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
        const absoluteId = getAbsoluteFileId(validId);

        debug(() => console.time(`[compiler] ${absoluteId}`));
        const { source, watchFiles } = await compiler.processVanillaFile(
          absoluteId,
          { outputCss: outputCss },
        );
        debug(() => console.timeEnd(`[compiler] ${absoluteId}`));

        addWatchFiles.call(this, absoluteId, watchFiles);

        // We have to invalidate the virtual module, not the real one we just transformed
        invalidateModule(fileIdToVirtualId(absoluteId));

        return {
          code: source,
          map: { mappings: '' },
        };
      }

      debug(() => console.time(`[current] ${validId}`));
      const { source, watchFiles } = await compile({
        filePath: validId,
        cwd: config.root,
        esbuildOptions,
        identOption,
      });

      const output = await processVanillaFile({
        source,
        filePath: validId,
        identOption,
        serializeVirtualCssPath: async ({ fileScope, source }) => {
          const rootRelativeId = `${fileScope.filePath}${virtualExtCss}`;
          const absoluteId = getAbsoluteFileId(rootRelativeId);

          if (cssMap.has(absoluteId) && cssMap.get(absoluteId) !== source) {
            invalidateModule(absoluteId);
          }

          cssMap.set(absoluteId, source);

          // We use the root relative id here to ensure file contents (content-hashes)
          // are consistent across build machines
          return `import "${rootRelativeId}";`;
        },
      });
      debug(() => console.timeEnd(`[current] ${validId}`));

      addWatchFiles.call(this, validId, new Set(watchFiles));

      return {
        code: output,
        map: { mappings: '' },
      };
    },
    buildEnd() {
      compiler?.close();
    },
  };
}
