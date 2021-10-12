import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';
import outdent from 'outdent';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  hash,
  getPackageInfo,
  IdentifierOption,
  addFileScope,
  stringifyFileScope,
  parseFileScope,
} from '@vanilla-extract/integration';

interface Options {
  identifiers?: IdentifierOption;

  /**
   * Which CSS runtime to use when running `vite serve`.
   * @default 'vite'
   */
  devStyleRuntime?: 'vite' | 'vanilla-extract';
}
export function vanillaExtractPlugin({
  identifiers,
  devStyleRuntime = 'vite',
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let packageInfo: ReturnType<typeof getPackageInfo>;
  let useRuntime = false;
  const cssMap = new Map<string, string>();

  let virtualExt: string;

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    config(_userConfig, env) {
      useRuntime =
        devStyleRuntime === 'vanilla-extract' && env.command === 'serve';

      const include = useRuntime ? ['@vanilla-extract/css/injectStyles'] : [];

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

      virtualExt = `.vanilla.${useRuntime ? 'js' : 'css'}?hash=`;

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

        if (!cssMap.has(fileScopeId)) {
          throw new Error(`Unable to locate ${fileScopeId} in the CSS map.`);
        }

        const css = cssMap.get(fileScopeId)!;

        if (!useRuntime) {
          return css;
        }

        const fileScope = parseFileScope(fileScopeId);

        return outdent`
          import { injectStyles } from '@vanilla-extract/css/injectStyles';
          
          injectStyles({
            fileScope: ${JSON.stringify(fileScope)},
            css: ${JSON.stringify(css)}
          })
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

          cssMap.set(fileId, source);

          return `import "${fileId}${virtualExt}${hash(source)}";`;
        },
      });
    },
  };
}
