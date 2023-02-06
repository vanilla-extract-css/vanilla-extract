import path from 'path';

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';
import outdent from 'outdent';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  getPackageInfo,
  CompileOptions,
  ProcessVanillaFileOptions,
  transform,
} from '@vanilla-extract/integration';
import { PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

const virtualExtCss = '.vanilla.css';
const virtualExtJs = '.vanilla.js';
const virtualRE = /.vanilla.(css|js)$/;

export interface VanillaExtractPluginOptions
  extends Pick<
    ProcessVanillaFileOptions,
    'onEvaluated' | 'serializeVanillaModule'
  > {
  identifiers?: IdentifierOption;
  esbuildOptions?: CompileOptions['esbuildOptions'];
  forceEmitCssInSsrBuild?: boolean;
}
export function vanillaExtractPlugin({
  identifiers,
  esbuildOptions,
  onEvaluated,
  serializeVanillaModule,
  forceEmitCssInSsrBuild: _forceEmitCssInSsrBuild,
}: VanillaExtractPluginOptions = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let postCssConfig: PostCSSConfigResult | null;
  const cssMap = new Map<string, string>();

  let forceEmitCssInSsrBuild: boolean =
    _forceEmitCssInSsrBuild || !!process.env.VITE_RSC_BUILD;
  let packageInfos: ReturnType<typeof getPackageInfo>;

  const getAbsoluteVirtualFileId = (source: string) =>
    normalizePath(path.join(config.root, source));

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    configureServer(_server) {
      server = _server;
    },
    config(_userConfig, env) {
      const include =
        env.command === 'serve' ? ['@vanilla-extract/css/injectStyles'] : [];

      return {
        optimizeDeps: { include },
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
      packageInfos = getPackageInfo(config.root);

      if (config.command === 'serve') {
        postCssConfig = await resolvePostcssConfig(config);
      }

      if (
        config.plugins.some((plugin) =>
          [
            'astro:build',
            'solid-start-server',
            'vite-plugin-qwik',
            'vite-plugin-svelte',
          ].includes(plugin.name),
        )
      ) {
        forceEmitCssInSsrBuild = true;
      }
    },
    // Re-parse .css.ts files when they change
    async handleHotUpdate({ file, modules }) {
      if (!cssFileFilter.test(file)) return;
      try {
        const virtuals: any[] = [];
        const invalidate = (type: string) => {
          const found = server.moduleGraph.getModulesByFile(`${file}${type}`);
          found?.forEach((m) => {
            virtuals.push(m);
            return server.moduleGraph.invalidateModule(m);
          });
        };
        invalidate(virtualExtCss);
        invalidate(virtualExtJs);
        // load new CSS
        await server.ssrLoadModule(file);
        return [...modules, ...virtuals];
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        throw e;
      }
    },
    // Convert .vanilla.(js|css) URLs to their absolute version
    resolveId(source, importer) {
      const [validId, query] = source.split('?');
      if (!validId.endsWith(virtualExtCss) && !validId.endsWith(virtualExtJs)) {
        return;
      }

      // while source is .css.ts.vanilla.(js|css), the importer should always be a .css.ts or .html file
      if (!importer) return;

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteVirtualFileId(validId);

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .vanilla.js/.vanilla.css extension
      // Keep the original query string for HMR.
      return absoluteId + (query ? `?${query}` : '');
    },
    // Provide virtual CSS content
    async load(id) {
      const [validId] = id.split('?');

      if (!virtualRE.test(validId)) {
        return;
      }

      if (!cssMap.has(validId)) {
        // Try to parse the parent
        const parentId = validId.replace(virtualRE, '');
        await server.ssrLoadModule(parentId);
        // Now we should have the CSS
        if (!cssMap.has(validId)) return;
      }

      const css = cssMap.get(validId);

      if (typeof css !== 'string') {
        return;
      }

      if (validId.endsWith(virtualExtCss)) {
        return css;
      }

      return outdent`
        import { injectStyles } from '@vanilla-extract/css/injectStyles';

        const inject = (css) => injectStyles({
          fileScope: ${JSON.stringify({ filePath: validId })},
          css
        });

        inject(${JSON.stringify(css)});

        if (import.meta.hot) {
          import.meta.hot.on('${styleUpdateEvent(validId)}', (css) => {
            inject(css);
          });
        }
      `;
    },
    async transform(code, id, ssrParam) {
      const [validId] = id.split('?');

      if (!cssFileFilter.test(validId)) {
        return null;
      }

      const identOption =
        identifiers ?? (config.mode === 'production' ? 'short' : 'debug');

      let ssr: boolean | undefined;

      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam;
      } else {
        ssr = ssrParam?.ssr;
      }

      let filePackageInfos = packageInfos;
      const fileDirectory = path.dirname(validId);
      if (!isSubDir(packageInfos.dirname, fileDirectory)) {
        filePackageInfos = getPackageInfo(fileDirectory);
      }

      if (ssr && !forceEmitCssInSsrBuild) {
        return transform({
          source: code,
          filePath: normalizePath(validId),
          rootPath: filePackageInfos.dirname,
          packageName: filePackageInfos.name,
          identOption,
        });
      }

      const { source, watchFiles } = await compile({
        filePath: validId,
        cwd: filePackageInfos.dirname,
        esbuildOptions,
        identOption,
      });

      for (const file of watchFiles) {
        // In start mode, we need to prevent the file from rewatching itself.
        // If it's a `build --watch`, it needs to watch everything.
        if (config.command === 'build' || file !== validId) {
          this.addWatchFile(file);
        }
      }

      const output = await processVanillaFile({
        source,
        filePath: validId,
        identOption,
        onEvaluated,
        serializeVanillaModule,
        serializeVirtualCssPath: async ({ fileScope, source }) => {
          const rootRelativeId = `${fileScope.filePath}${
            config.command === 'build' || forceEmitCssInSsrBuild
              ? virtualExtCss
              : virtualExtJs
          }`;
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId);

          let cssSource = source;

          if (postCssConfig) {
            const postCssResult = await (await import('postcss'))
              .default(postCssConfig.plugins)
              .process(source, {
                ...postCssConfig.options,
                from: undefined,
                map: false,
              });

            cssSource = postCssResult.css;
          }

          if (
            server &&
            cssMap.has(absoluteId) &&
            cssMap.get(absoluteId) !== cssSource
          ) {
            const { moduleGraph } = server;
            const [module] = Array.from(
              moduleGraph.getModulesByFile(absoluteId) || [],
            );

            if (module) {
              moduleGraph.invalidateModule(module);

              // Vite uses this timestamp to add `?t=` query string automatically for HMR.
              module.lastHMRTimestamp =
                (module as any).lastInvalidationTimestamp || Date.now();
            }

            server.ws.send({
              type: 'custom',
              event: styleUpdateEvent(absoluteId),
              data: cssSource,
            });
          }

          cssMap.set(absoluteId, cssSource);

          // We use the root relative id here to ensure file contents (content-hashes)
          // are consistent across build machines
          return `import "${rootRelativeId}";`;
        },
      });

      return {
        code: output,
        map: { mappings: '' },
      };
    },
  };
}

function isSubDir(parent: string, dir: string) {
  const relative = path.relative(parent, dir);
  return Boolean(
    relative && !relative.startsWith('..') && !path.isAbsolute(relative),
  );
}
