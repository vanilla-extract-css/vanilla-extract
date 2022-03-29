import type { Plugin } from 'rollup';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  getSourceFromVirtualCssFile,
  virtualCssFileFilter,
} from '@vanilla-extract/integration';
import { relative, normalize, dirname } from 'path';

const virtualPrefix = 'virtual:vanilla-extract:';

interface Options {
  identifiers?: IdentifierOption;
  cwd?: string;
}
export function vanillaExtractPlugin({ identifiers, cwd = process.cwd() }: Options = {}): Plugin {
  const emittedFiles = new Map<string, string>();
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: 'vanilla-extract',
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
      });
    },
    async resolveId(id) {
      // Only handle virtual css modules here
      if (!virtualCssFileFilter.test(id)) {
        return null;
      }

      // Emit the css asset
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
      // Replace external virtual imports with emitted css files
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
