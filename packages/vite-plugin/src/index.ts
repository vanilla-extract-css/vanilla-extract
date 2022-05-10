import path from 'path';

import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';
import outdent from 'outdent';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  addFileScope,
  getPackageInfo,
} from '@vanilla-extract/integration';
import { PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

interface Options {
  identifiers?: IdentifierOption;
}
export function vanillaExtractPlugin({ identifiers }: Options = {}): Plugin {
  let config: ResolvedConfig;
  let server: ViteDevServer;
  let postCssConfig: PostCSSConfigResult | null;
  const cssMap = new Map<string, string>();

  let virtualExt: string;
  let packageName: string;

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
      packageName = getPackageInfo(config.root).name;

      if (config.command === 'serve') {
        postCssConfig = await resolvePostcssConfig(config);
      }

      virtualExt = `.vanilla.${config.command === 'serve' ? 'js' : 'css'}`;
    },
    resolveId(id) {
      if (!id.endsWith(virtualExt)) {
        return;
      }

      const normalizedId = id.startsWith('/') ? id.slice(1) : id;

      if (cssMap.has(normalizedId)) {
        return normalizePath(path.join(config.root, normalizedId));
      }
    },
    load(id) {
      if (!id.endsWith(virtualExt)) {
        return;
      }

      const cssFileId = id.slice(config.root.length + 1);
      const css = cssMap.get(cssFileId);

      if (typeof css !== 'string') {
        return;
      }

      if (!server) {
        return css;
      }

      return outdent`
        import { injectStyles } from '@vanilla-extract/css/injectStyles';
        
        const inject = (css) => injectStyles({
          fileScope: ${JSON.stringify({ filePath: cssFileId })},
          css
        });

        inject(${JSON.stringify(css)});

        import.meta.hot.on('${styleUpdateEvent(cssFileId)}', (css) => {
          inject(css);
        });   
      `;
    },
    async transform(code, id, ssrParam) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      let ssr: boolean | undefined;

      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam;
      } else {
        ssr = ssrParam?.ssr;
      }

      const index = id.indexOf('?');
      const validId = index === -1 ? id : id.substring(0, index);

      if (ssr) {
        return addFileScope({
          source: code,
          filePath: normalizePath(validId),
          rootPath: config.root,
          packageName,
        });
      }

      const { source, watchFiles } = await compile({
        filePath: validId,
        cwd: config.root,
      });

      for (const file of watchFiles) {
        // In start mode, we need to prevent the file from rewatching itself.
        // If it's a `build --watch`, it needs to watch everything.
        if (config.command === 'build' || file !== id) {
          this.addWatchFile(file);
        }
      }

      return processVanillaFile({
        source,
        filePath: validId,
        identOption:
          identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
        serializeVirtualCssPath: async ({ fileScope, source }) => {
          const id = `${fileScope.filePath}${virtualExt}`;

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

          if (server && cssMap.has(id) && cssMap.get(id) !== source) {
            const { moduleGraph } = server;
            const module = moduleGraph.getModuleById(id);

            if (module) {
              moduleGraph.invalidateModule(module);
            }

            server.ws.send({
              type: 'custom',
              event: styleUpdateEvent(id),
              data: cssSource,
            });
          }

          cssMap.set(id, cssSource);

          return `import "${id}";`;
        },
      });
    },
  };
}
