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

const DEBUG = process.env.DEBUG?.includes('vanilla-extract') ?? false;

const virtualExtCss = '.vanilla.css';

const fileIdToVirtualId = (id: string) => `${id}${virtualExtCss}`;
const virtualIdToFileId = (virtualId: string) =>
  virtualId.replace(virtualExtCss, '');

interface Options {
  identifiers?: IdentifierOption;
  emitCssInSsr?: boolean | 'compiler';
  esbuildOptions?: CompileOptions['esbuildOptions'];
}
export function vanillaExtractPlugin({
  identifiers,
  emitCssInSsr = true,
  esbuildOptions,
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let packageName: string;
  let compiler: Compiler | undefined;

  const cssMap = new Map<string, string>();

  const getAbsoluteFileId = (filePath: string) => {
    let resolvedId = filePath;

    if (
      filePath.startsWith(config.root) ||
      (path.isAbsolute(filePath) && filePath.includes('node_modules'))
    ) {
      resolvedId = filePath;
    } else {
      // in SSR mode we can have paths like /app/styles.css.ts
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

      if (emitCssInSsr === 'compiler') {
        compiler = createCompiler({
          root: config.root,
          identifiers:
            identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
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

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      const absoluteId = getAbsoluteFileId(validId);

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .vanilla.js/.vanilla.css extension
      if (
        compiler?.getCssForFile(virtualIdToFileId(absoluteId)) ||
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

        let { css } =
          compiler.getCssForFile(virtualIdToFileId(absoluteId)) ?? {};

        return css;
      }

      const css = cssMap.get(validId);

      return css;
    },
    async transform(code, id) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      if (compiler) {
        const absoluteId = getAbsoluteFileId(validId);

        if (DEBUG) console.time(`[compiler] ${validId}`);
        const { source, watchFiles } = await compiler.processVanillaFile(
          absoluteId,
          { outputCss: true },
        );
        if (DEBUG) console.timeEnd(`[compiler] ${validId}`);

        addWatchFiles.call(this, absoluteId, watchFiles);

        // We have to invalidate the virtual module, not the real one we just transformed
        invalidateModule(fileIdToVirtualId(absoluteId));

        return {
          code: source,
          map: { mappings: '' },
        };
      }

      const identOption =
        identifiers ?? (config.mode === 'production' ? 'short' : 'debug');

      if (!emitCssInSsr) {
        return transform({
          source: code,
          filePath: normalizePath(validId),
          rootPath: config.root,
          packageName,
          identOption,
        });
      }

      if (DEBUG) console.time(`[current] ${validId}`);
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
      if (DEBUG) console.timeEnd(`[current] ${validId}`);

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
