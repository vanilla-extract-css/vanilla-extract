import path from 'path';
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite';
import { normalizePath } from 'vite';
import outdent from 'outdent';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  getPackageInfo,
  IdentifierOption,
  addFileScope,
  stringifyFileScope,
  parseFileScope,
} from '@vanilla-extract/integration';
import { PostCSSConfigResult, resolvePostcssConfig } from './postcss';

const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

const virtualPrefix = 'virtual:vanilla-extract:';

interface Options {
  identifiers?: IdentifierOption;
}
export function vanillaExtractPlugin({ identifiers }: Options = {}): Plugin {
  let config: ResolvedConfig;
  let packageInfo: ReturnType<typeof getPackageInfo>;
  let server: ViteDevServer;
  let postCssConfig: PostCSSConfigResult | null;
  const cssMap = new Map<string, string>();

  let virtualExt: string;

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

      if (config.command === 'serve') {
        postCssConfig = await resolvePostcssConfig(config);
      }

      virtualExt = `.vanilla.${config.command === 'serve' ? 'js' : 'css'}`;

      packageInfo = getPackageInfo(config.root);
    },
    resolveId(id) {
      if (id.indexOf(virtualPrefix) === 0) {
        return id;
      }
    },
    load(id) {
      if (id.indexOf(virtualPrefix) === 0) {
        const fileScopeId = id.slice(
          virtualPrefix.length,
          id.indexOf(virtualExt),
        );

        if (!cssMap.has(fileScopeId)) {
          throw new Error(`Unable to locate ${fileScopeId} in the CSS map.`);
        }

        const css = cssMap.get(fileScopeId)!;

        if (!server) {
          return css;
        }

        const fileScope = parseFileScope(fileScopeId);

        return outdent`
          import { injectStyles } from '@vanilla-extract/css/injectStyles';
          
          const inject = (css) => injectStyles({
            fileScope: ${JSON.stringify(fileScope)},
            css
          });

          inject(${JSON.stringify(css)});

          import.meta.hot.on('${styleUpdateEvent(fileScopeId)}', (css) => {
            inject(css);
          });   
        `;
      }

      return null;
    },
    async transform(code, id, ssrParam) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      let ssr: boolean | undefined;

      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam;
      } else {
        // @ts-ignore If vite 2.6 is installed, this will trigger a `never` error
        ssr = ssrParam?.ssr;
      }

      const index = id.indexOf('?');
      const validId = index === -1 ? id : id.substring(0, index);

      if (ssr) {
        return addFileScope({
          source: code,
          filePath: normalizePath(path.relative(packageInfo.dirname, validId)),
          packageInfo,
        }).source;
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
          const fileId = stringifyFileScope(fileScope);
          const id = `${virtualPrefix}${fileId}${virtualExt}`;

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

          if (server && cssMap.has(fileId) && cssMap.get(fileId) !== source) {
            const { moduleGraph } = server;
            const module = moduleGraph.getModuleById(id);

            if (module) {
              moduleGraph.invalidateModule(module);
            }

            server.ws.send({
              type: 'custom',
              event: styleUpdateEvent(fileId),
              data: cssSource,
            });
          }

          cssMap.set(fileId, cssSource);

          return `import "${id}";`;
        },
      });
    },
  };
}
