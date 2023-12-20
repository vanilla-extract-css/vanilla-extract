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
} from '@vanilla-extract/integration';
import { type PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const virtualExtCss = '.vanilla.css';
const cssImportSpecifier = (filePath: string) => `${filePath}${virtualExtCss}`;

// Inlined from @rollup/pluginutils
// https://github.com/rollup/plugins/blob/33174f956304ab4aad4bbaba656f627c31679dc5/packages/pluginutils/src/normalizePath.ts#L5-L7
const normalizePath = (filename: string) =>
  filename.split(path.win32.sep).join(path.posix.sep);

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

  const getAbsoluteFileId = (source: string) =>
    normalizePath(path.resolve(config.root, source));

  const invalidateModule = (absoluteId: string) => {
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
          cssImportSpecifier,
          vitePlugins: (config.inlineConfig.plugins ?? [])
            .flat()
            // Prevent an infinite loop where the child compiler creates a new child compiler
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
      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteFileId(validId);

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .vanilla.js/.vanilla.css extension
      if (cssMap.has(absoluteId)) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : '');
      }
    },
    load(id) {
      const [validId] = id.split('?');

      const css = cssMap.get(validId);

      if (typeof css === 'string' && validId.endsWith(virtualExtCss)) {
        return css;
      }
    },
    async transform(code, id) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      const identOption =
        identifiers ?? (config.mode === 'production' ? 'short' : 'debug');

      if (compiler) {
        const absoluteVirtualId = cssImportSpecifier(validId);

        console.time(`[compiler] ${validId}`);
        const { source, watchFiles } = await compiler.processVanillaFile(
          validId,
        );

        let { css } = compiler.getCssForFile(validId);
        console.timeEnd(`[compiler] ${validId}`);

        if (postCssConfig) {
          css = await processCss(css);
        }

        for (const file of watchFiles) {
          // In start mode, we need to prevent the file from rewatching itself.
          // If it's a `build --watch`, it needs to watch everything.
          if (config.command === 'build' || normalizePath(file) !== validId) {
            this.addWatchFile(file);
          }
        }

        if (
          cssMap.has(absoluteVirtualId) &&
          cssMap.get(absoluteVirtualId) !== css
        ) {
          invalidateModule(absoluteVirtualId);
        }

        cssMap.set(absoluteVirtualId, css);

        return {
          code: source,
          map: { mappings: '' },
        };
      }

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
  };
}
