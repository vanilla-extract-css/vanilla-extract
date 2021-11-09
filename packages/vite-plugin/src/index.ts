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

const styleUpdateEvent = (fileId: string) =>
  `vanilla-extract-style-update:${fileId}`;

interface Options {
  identifiers?: IdentifierOption;
}
export function vanillaExtractPlugin({ identifiers }: Options = {}): Plugin {
  let config: ResolvedConfig;
  let packageInfo: ReturnType<typeof getPackageInfo>;
  let server: ViteDevServer;
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
    configResolved(resolvedConfig) {
      config = resolvedConfig;

      virtualExt = `.vanilla.${config.command === 'serve' ? 'js' : 'css'}`;

      packageInfo = getPackageInfo(config.root);
    },
    resolveId(id) {
      if (id.indexOf(virtualExt) > 0) {
        return id;
      }
    },
    load(id) {
      const extensionIndex = id.indexOf(virtualExt);

      if (extensionIndex > 0) {
        const fileScopeId = id.substring(0, extensionIndex);
        const normalizedFileId = normalizePath(`/${fileScopeId}`);

        if (!cssMap.has(normalizedFileId)) {
          throw new Error(`Unable to locate ${normalizedFileId} in the CSS map.`);
        }

        const css = cssMap.get(normalizedFileId)!;

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
    async transform(code, id, ssr) {
      if (!cssFileFilter.test(id)) {
        return null;
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
        serializeVirtualCssPath: ({ fileScope, source }) => {
          const fileId = stringifyFileScope(fileScope);
          const id = `${fileId}${virtualExt}`;
          const normalizedFileId = normalizePath(`/${fileId}`);

          if (server && cssMap.has(normalizedFileId) && cssMap.get(normalizedFileId) !== source) {
            const { moduleGraph } = server;
            const module = moduleGraph.getModuleById(id);

            if (module) {
              moduleGraph.invalidateModule(module);
            }

            server.ws.send({
              type: 'custom',
              event: styleUpdateEvent(normalizedFileId),
              data: source,
            });
          }

          cssMap.set(normalizedFileId, source);

          return `import "${id}";`;
        },
      });
    },
  };
}
