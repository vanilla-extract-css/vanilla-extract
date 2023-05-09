import type { Plugin } from 'rollup';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  IdentifierOption,
  getSourceFromVirtualCssFile,
  virtualCssFileFilter,
  CompileOptions,
} from '@vanilla-extract/integration';
import { posix } from 'path';

const { relative, normalize, dirname } = posix;

interface Options {
  identifiers?: IdentifierOption;
  cwd?: string;
  esbuildOptions?: CompileOptions['esbuildOptions'];
}
export function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd(),
  esbuildOptions,
}: Options = {}): Plugin {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    name: 'vanilla-extract',
    // Transform .css.js to .js
    async transform(_code, id) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const index = id.indexOf('?');
      const filePath = index === -1 ? id : id.substring(0, index);

      const identOption = identifiers ?? (isProduction ? 'short' : 'debug');

      const { source, watchFiles } = await compile({
        filePath,
        cwd,
        esbuildOptions,
        identOption,
      });

      for (const file of watchFiles) {
        this.addWatchFile(file);
      }

      const output = await processVanillaFile({
        source,
        filePath,
        identOption,
      });
      return {
        code: output,
        map: { mappings: '' },
      };
    },
    // Resolve .css to external module
    async resolveId(id) {
      if (!virtualCssFileFilter.test(id)) {
        return null;
      }
      const { fileName, source } = await getSourceFromVirtualCssFile(id);
      return {
        id: fileName,
        external: true,
        meta: {
          css: source,
        },
      };
    },
    // Emit .css assets
    moduleParsed(moduleInfo) {
      moduleInfo.importedIdResolutions.forEach((resolution) => {
        if (resolution.meta.css) {
          resolution.meta.assetId = this.emitFile({
            type: 'asset',
            name: resolution.id,
            source: resolution.meta.css,
          });
        }
      });
    },
    // Replace .css import paths with relative paths to emitted css files
    renderChunk(code, chunkInfo) {
      const chunkPath = dirname(chunkInfo.fileName);
      const output = chunkInfo.imports.reduce((codeResult, importPath) => {
        const moduleInfo = this.getModuleInfo(importPath);
        if (!moduleInfo?.meta.assetId) {
          return codeResult;
        }
        const assetPath = this.getFileName(moduleInfo?.meta.assetId);
        const relativeAssetPath = `./${normalize(
          relative(chunkPath, assetPath),
        )}`;
        return codeResult.replace(importPath, relativeAssetPath);
      }, code);

      return {
        code: output,
        map: chunkInfo.map ?? null,
      };
    },
  };
}
