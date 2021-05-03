import type { Plugin, ResolvedConfig } from 'vite';
import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  virtualCssFileWithoutSourceFilter,
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
        const { fileName, source } = getSourceFromVirtualCssFile(id);

        console.log({ id: fileName, meta: { vanillaExtract: { source } } });

        return { id: fileName, meta: { vanillaExtract: { source } } };
      }
    },
    async load(id, ssr) {
      if (cssFileFilter.test(id)) {
        const moduleInfo = this.getModuleInfo(id);

        console.log(id, moduleInfo);
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

      if (virtualCssFileWithoutSourceFilter.test(id)) {
        const moduleInfo = this.getModuleInfo(id);

        console.log(id, moduleInfo);

        if (!moduleInfo?.meta?.vanillaExtract?.source) {
          throw new Error(
            `Cound't read source from generated vanilla-extract CSS file: ${id}`,
          );
        }

        return moduleInfo.meta.vanillaExtract.source;
      }

      return null;
    },
  };
}
