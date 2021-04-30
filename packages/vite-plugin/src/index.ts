import type { Plugin, ResolvedConfig } from 'vite';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
} from '@vanilla-extract/integration';

export default function vanillaExtractPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'vanilla-extract',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (virtualCssFileFilter.test(id)) {
        return id;
      }
    },
    async load(id, ssr) {
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

      if (virtualCssFileFilter.test(id)) {
        return getSourceFromVirtualCssFile(id);
      }

      return null;
    },
  };
}
