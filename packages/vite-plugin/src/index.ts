import type { Plugin, ResolvedConfig } from 'vite';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  hash,
} from '@vanilla-extract/integration';

export function vanillaExtractPlugin(): Plugin {
  let config: ResolvedConfig;
  const cssMap = new Map<string, string>();

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (virtualCssFileFilter.test(id)) {
        const { fileName, source } = getSourceFromVirtualCssFile(id);

        // resolveId shouldn't really cause a side-effect however custom module meta isn't currently working
        // This is a hack work around until https://github.com/vitejs/vite/issues/3240 is resolved
        const shortHashFileName = `${fileName}?hash=${hash(source)}`;
        cssMap.set(shortHashFileName, source);

        return shortHashFileName;
      }
    },
    load(id) {
      if (cssMap.has(id)) {
        const css = cssMap.get(id);

        cssMap.delete(id);

        return css;
      }

      return null;
    },
    async transform(_code, id, ssr) {
      if (cssFileFilter.test(id)) {
        const { source, watchFiles } = await compile({
          filePath: id,
          cwd: config.root,
        });

        for (const file in watchFiles) {
          this.addWatchFile(file);
        }

        return processVanillaFile({
          source,
          filePath: id,
          outputCss: !ssr,
        });
      }

      return null;
    },
  };
}
