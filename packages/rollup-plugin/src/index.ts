import type { Plugin } from 'rollup';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  getSourceFromVirtualCssFile,
  serializeCss,
} from '@vanilla-extract/integration';
import { relative, normalize, dirname } from 'path';

const virtualPrefix = 'virtual:vanilla-extract:';
const vanillaSuffix = '.vanilla.css';

interface Options {
  identifiers?: IdentifierOption;
  cwd?: string;
}
export function vanillaExtractPlugin({ identifiers, cwd = process.cwd() }: Options = {}): Plugin {
  const emittedFiles = new Map<string, string>();
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: 'vanilla-extract',
    outputOptions(outputOptions) {
      if (outputOptions.format && !['es', 'esm', 'module'].includes(outputOptions.format)) {
        this.warn('Only format \'esm\' is supported, others should NOT be used with this plugin');
      }
      return outputOptions;
    },
    async transform(_code, id) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const index = id.indexOf('?');
      const filePath = index === -1 ? id : id.substring(0, index);

      const { source, watchFiles } = await compile({
        filePath,
        cwd,
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      return processVanillaFile({
        source,
        filePath,
        identOption: identifiers ?? (isProduction ? 'short' : 'debug'),
        async serializeVirtualCssPath({ fileScope, source }) {
          // This is almost identical to processVanillaFile's default behavior,
          // minus the package name in the fileName, in order to
          // place emitted assets at more sensible paths.
          const serializedCss = await serializeCss(source);
          const fileName = `${fileScope.filePath}${vanillaSuffix}`;
          return `import '${fileName}?source=${serializedCss}';`;
        }
      });
    },
    async resolveId(id) {
      // Resolve '.vanilla.css' imports
      if (id.indexOf(`${vanillaSuffix}?source`) === -1) return null;

      // Emit the CSS file
      const { fileName, source } = await getSourceFromVirtualCssFile(id);
      if (!emittedFiles.get(fileName)) {
        const assetId = this.emitFile({
          type: 'asset',
          name: fileName,
          source,
        });
        emittedFiles.set(fileName, assetId);
      }
      const assetId = emittedFiles.get(fileName);

      // Resolve to a temporary virtual external chunk
      return {
        id: `${virtualPrefix}${assetId}`,
        external: true,
      };
    },
    renderChunk(code, chunkInfo) {
      // Replace external virtual imports with emitted CSS files
      const chunkPath = dirname(chunkInfo.fileName);
      const importsToReplace = chunkInfo.imports.filter((i) => i.startsWith(virtualPrefix));
      if (!importsToReplace.length) return null;
      return importsToReplace.reduce((codeResult, importPath) => {
        const assetId = importPath.replace(virtualPrefix, '');
        const assetName = this.getFileName(assetId);
        return codeResult.replace(importPath, `./${normalize(relative(chunkPath, assetName))}`);
      }, code);
    },
  };
}
