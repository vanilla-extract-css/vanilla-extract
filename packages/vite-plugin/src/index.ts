import path from 'path';
import type { Plugin, ResolvedConfig } from 'vite';
import { normalizePath } from 'vite';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  hash,
  getPackageInfo,
  IdentifierOption,
  addFileScope,
} from '@vanilla-extract/integration';

interface Options {
  identifiers?: IdentifierOption;

  /**
   * Which CSS runtime to use when running `vite serve`.
   * @default 'vite'
   */
  devStyleRuntime?: 'vite' | 'vanilla-extract';
}

const VIRTUAL_PREFIX = `/@vanilla-extract:`;

export function vanillaExtractPlugin({
  identifiers,
  devStyleRuntime = 'vite',
}: Options = {}): Plugin {
  let config: ResolvedConfig;
  let packageInfo: ReturnType<typeof getPackageInfo>;
  let useRuntime = false;
  const cssMap = new Map<string, string>();

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      useRuntime =
        devStyleRuntime === 'vanilla-extract' && config.command === 'serve';

      packageInfo = getPackageInfo(config.root);
    },
    resolveId(id) {
      if (virtualCssFileFilter.test(id)) {
        const { fileName, source } = getSourceFromVirtualCssFile(id);

        // resolveId shouldn't really cause a side-effect however custom module meta isn't currently working
        // This is a hack work around until https://github.com/vitejs/vite/issues/3240 is resolved
        const shortHashFileName = normalizePath(
          `${fileName}?hash=${hash(source)}`,
        );
        cssMap.set(shortHashFileName, source);

        return VIRTUAL_PREFIX + shortHashFileName;
      }
    },
    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null;
      }

      const shortHashFileName = id.substr(VIRTUAL_PREFIX.length);
      if (cssMap.has(shortHashFileName)) {
        const css = cssMap.get(shortHashFileName);

        cssMap.delete(shortHashFileName);

        return css;
      }

      return null;
    },
    async transform(code, id, ssr) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const usedIndex = id.indexOf('?used');
      const fixedId = usedIndex > 0 ? id.substring(0, usedIndex) : id;

      if (ssr || useRuntime) {
        return addFileScope({
          source: code,
          filePath: normalizePath(path.relative(packageInfo.dirname, fixedId)),
          packageInfo,
        }).source;
      }

      const { source, watchFiles } = await compile({
        filePath: fixedId,
        cwd: config.root,
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      return processVanillaFile({
        source,
        filePath: fixedId,
        outputCss: !ssr,
        identOption:
          identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
      });
    },
  };
}
