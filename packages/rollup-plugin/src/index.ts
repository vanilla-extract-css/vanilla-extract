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

      // Resolve to an external chunk
      return {
        id: fileName,
        external: true,
      };
    },
    renderChunk(code, chunkInfo) {
      // For all imports that we emitted files for...
      const importsToReplace = chunkInfo.imports.filter((fileName) => emittedFiles.get(fileName));
      if (!importsToReplace.length) return null;

      // Replace css imports in chunks with relative paths to emitted css files
      const chunkPath = dirname(chunkInfo.fileName);
      return importsToReplace.reduce((codeResult, importPath) => {
        const assetId = emittedFiles.get(importPath)!;
        const assetName = this.getFileName(assetId);
        const fixedImportPath = `./${normalize(relative(chunkPath, assetName))}`;
        return codeResult.replace(importPath, fixedImportPath);
      }, code);
    },
  };
}
