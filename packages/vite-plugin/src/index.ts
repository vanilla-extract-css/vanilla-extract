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
    config(userConfig, env) {
      useRuntime =
        devStyleRuntime === 'vanilla-extract' && env.command === 'serve';

      const optimizeDeps = {
        ...userConfig.optimizeDeps,
        include: userConfig.optimizeDeps?.include ?? [],
      };

      optimizeDeps.include.push(
        '@vanilla-extract/css',
        '@vanilla-extract/css/fileScope',
      );

      if (useRuntime) {
        optimizeDeps.include.push('@vanilla-extract/css/injectStyles');
      }

      userConfig.optimizeDeps = optimizeDeps;
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
        if (cssMap.has(fileScopeId)) {
          const css = cssMap.get(fileScopeId)!;

          if (useRuntime) {
            const fileScope = JSON.stringify(parseFileScope(fileScopeId));

            return outdent`
              import { injectStyles } from '@vanilla-extract/css/injectStyles';
              
              injectStyles({
                fileScope: ${fileScope},
                css: ${JSON.stringify(css)}
              })
            `;
          }

          return css;
        }
      }

      return null;
    },
    async transform(code, id, ssr) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      if (ssr) {
        const [validId] = id.split('?');
        return addFileScope({
          source: code,
          filePath: normalizePath(path.relative(packageInfo.dirname, validId)),
          packageInfo,
        }).source;
      }

      const { source, watchFiles } = await compile({
        filePath: id,
        cwd: config.root,
      });

      for (const file of watchFiles) {
        if (config.command === 'build' || file !== id) {
          this.addWatchFile(file);
        }
      }

      return processVanillaFile({
        source,
        filePath: id,
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
