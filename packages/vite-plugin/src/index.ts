import path from 'path';

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';
import outdent from 'outdent';
import { IdentifierOption, InlineCompiler } from '@vanilla-extract/integration';
import { PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

const virtualExtCss = '.vanilla.css';
const virtualExtJs = '.vanilla.js';

interface Options {
  identifiers?: IdentifierOption;
  emitCssInSsr?: boolean;
}
export function vanillaExtractPlugin({
  identifiers,
  emitCssInSsr,
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let postCssConfig: PostCSSConfigResult | null;
  const cssMap = new Map<string, string>();

  const hasEmitCssOverride = typeof emitCssInSsr === 'boolean';
  let resolvedEmitCssInSsr: boolean = hasEmitCssOverride
    ? emitCssInSsr
    : !!process.env.VITE_RSC_BUILD;

  const getAbsoluteVirtualFileId = (source: string) =>
    normalizePath(path.join(config.root, source));

  let compiler: InlineCompiler;

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
      compiler = new InlineCompiler({
        root: config.root,
        identifiers:
          identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
      });

      if (config.command === 'serve') {
        postCssConfig = await resolvePostcssConfig(config);
      }

      if (
        !hasEmitCssOverride &&
        config.plugins.some((plugin) =>
          [
            'astro:build',
            'solid-start-server',
            'vite-plugin-qwik',
            'vite-plugin-svelte',
          ].includes(plugin.name),
        )
      ) {
        resolvedEmitCssInSsr = true;
      }
    },
    resolveId(source) {
      const [validId, query] = source.split('?');
      if (!validId.endsWith(virtualExtCss) && !validId.endsWith(virtualExtJs)) {
        return;
      }

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteVirtualFileId(validId);

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

      if (!cssMap.has(validId)) {
        return;
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

      if (validId.endsWith(virtualExtCss) || validId.endsWith(virtualExtJs)) {
        return;
      }
      let ssr: boolean | undefined;

      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam;
      } else {
        ssr = ssrParam?.ssr;
      }

      const result = await compiler.processVanillaFile({
        code,
        filePath: normalizePath(validId),
        outputCss: !ssr || resolvedEmitCssInSsr,
        async cssImportSpecifier(filePath, css) {
          const rootRelativeId = `${filePath}${
            config.command === 'build' || (ssr && resolvedEmitCssInSsr)
              ? virtualExtCss
              : virtualExtJs
          }`;
          const absoluteId = getAbsoluteVirtualFileId(rootRelativeId);

          let cssSource = css;

          if (postCssConfig) {
            const postCssResult = await (await import('postcss'))
              .default(postCssConfig.plugins)
              .process(cssSource, {
                ...postCssConfig.options,
                from: undefined,
                map: false,
              });

            cssSource = postCssResult.css;
          }

          if (
            server &&
            cssMap.has(absoluteId) &&
            cssMap.get(absoluteId) !== css
          ) {
            const { moduleGraph } = server;
            const modules = Array.from(
              moduleGraph.getModulesByFile(absoluteId) || [],
            );

            for (const module of modules) {
              if (module) {
                moduleGraph.invalidateModule(module);

                // Vite uses this timestamp to add `?t=` query string automatically for HMR.
                module.lastHMRTimestamp =
                  (module as any).lastInvalidationTimestamp || Date.now();
              }
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
          return rootRelativeId;
        },
      });

      if (!result) {
        return null;
      }

      for (const file of result.watchFiles) {
        // In start mode, we need to prevent the file from rewatching itself.
        // If it's a `build --watch`, it needs to watch everything.
        if (config.command === 'build' || normalizePath(file) !== validId) {
          this.addWatchFile(file);
        }
      }

      return {
        code: result.source,
        map: { mappings: '' },
      };
    },
  };
}
