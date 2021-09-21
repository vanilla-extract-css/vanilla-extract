import { Plugin } from 'rollup';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
} from '@vanilla-extract/integration';

interface VanillaExtractPluginOptions {
  identifiers?: IdentifierOption;
  outputCss?: boolean;
  fileName?: string;
  cwd?: string;
}
export const vanillaExtractPlugin = ({
  identifiers = 'debug',
  outputCss = true,
  fileName = 'styles.css',
  cwd = process.cwd(),
}: VanillaExtractPluginOptions): Plugin => {
  const processedCssById = new Map<string, Array<string>>();

  return {
    name: 'vanilla-extract',

    async transform(_code, id) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const { source, watchFiles } = await compile({
        filePath: id,
        cwd,
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      const processedCss: Array<string> = [];

      const result = processVanillaFile({
        source,
        filePath: id,
        outputCss,
        identOption: identifiers,
        serializeVirtualCssPath: ({ base64Source }) => {
          const css = Buffer.from(base64Source, 'base64').toString('utf-8');
          processedCss.push(css);
          return '';
        },
      });

      processedCssById.set(id, processedCss);

      return result;
    },

    generateBundle() {
      if (!outputCss) {
        return;
      }

      const dedupedCss = new Set<string>();

      const moduleIds = [...this.getModuleIds()];
      moduleIds.forEach((moduleId) => {
        processedCssById.get(moduleId)?.forEach((css) => {
          dedupedCss.add(css);
        });
      });

      if (dedupedCss.size === 0) {
        return;
      }

      const source = [...dedupedCss.values()].join('\n');

      this.emitFile({
        type: 'asset',
        source,
        fileName,
      });
    },
  };
};
