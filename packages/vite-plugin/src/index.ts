import path from 'path';
import assert from 'assert';

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
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
import { type PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const virtualExtCss = '.vanilla.css';

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
  let postCssConfig: PostCSSConfigResult | null;
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
  const fileIdToVirtualId = (id: string) => `${id}${virtualExtCss}`;
  const virtualIdToFileId = (virtualId: string) =>
    virtualId.replace(virtualExtCss, '');

  function invalidateModule(absoluteId: string) {
    if (!server) return;

    const { moduleGraph } = server;
    const modules = Array.from(moduleGraph.getModulesByFile(absoluteId) || []);

    for (const module of modules) {
      moduleGraph.invalidateModule(module);

      // Vite uses this timestamp to add `?t=` query string automatically for HMR.
      module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now();
    }
  };
  const processCss = async (css: string) => {
    assert(postCssConfig);

    const postCssResult = await (await import('postcss'))
      .default(postCssConfig.plugins)
      .process(css, {
        ...postCssConfig.options,
        from: undefined,
        map: false,
      });

    return postCssResult.css;
  };

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
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

      if (config.command === 'serve') {
        postCssConfig = await resolvePostcssConfig(config);
      }

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
      if (!validId.endsWith(virtualExtCss)) {
        return;
      }

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

        console.time(`[compiler] ${validId}`);
        const { source, watchFiles } = await compiler.processVanillaFile(
          absoluteId,
          { outputCss: true },
        );
        console.timeEnd(`[compiler] ${absoluteId}`);

        for (const file of watchFiles) {
          // In start mode, we need to prevent the file from rewatching itself.
          // If it's a `build --watch`, it needs to watch everything.
          if (
            config.command === 'build' ||
            normalizePath(file) !== absoluteId
          ) {
            this.addWatchFile(file);
          }
        }

        // We have to invalidate the virtual module, not the real one we just transformed
        invalidateModule(fileIdToVirtualId(validId));

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

      console.time(`[current] ${validId}`);
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

          let cssSource = source;

          if (postCssConfig) {
            cssSource = await processCss(cssSource);
          }

          if (cssMap.has(absoluteId) && cssMap.get(absoluteId) !== cssSource) {
            invalidateModule(absoluteId);
          }

          cssMap.set(absoluteId, cssSource);

          // We use the root relative id here to ensure file contents (content-hashes)
          // are consistent across build machines
          return `import "${rootRelativeId}";`;
        },
      });
      console.timeEnd(`[current] ${validId}`);

      for (const file of watchFiles) {
        // In start mode, we need to prevent the file from rewatching itself.
        // If it's a `build --watch`, it needs to watch everything.
        if (config.command === 'build' || normalizePath(file) !== validId) {
          this.addWatchFile(file);
        }
      }

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
