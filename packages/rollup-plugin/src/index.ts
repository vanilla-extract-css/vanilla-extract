import type { Plugin } from 'rollup';
import {
  cssFileFilter,
  processVanillaFile,
  compile,
  type IdentifierOption,
  getSourceFromVirtualCssFile,
  virtualCssFileFilter,
  type CompileOptions,
} from '@vanilla-extract/integration';
import { posix } from 'path';
import { generateCssBundle, stripSideEffectImportsMatching } from './lib';

const { relative, normalize, dirname } = posix;

export interface Options {
  /**
   * Different formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can be configured by selecting from the following options:
   * - "short": 7+ character hash. e.g. hnw5tz3
   * - "debug": human readable prefixes representing the owning filename and a potential rule level debug name. e.g. myfile_mystyle_hnw5tz3
   * - custom function: takes an object parameter with `hash`, `filePath`, `debugId`, and `packageName`, and returns a customized identifier.
   * @default "short"
   * @example ({ hash }) => `prefix_${hash}`
   */
  identifiers?: IdentifierOption;
  /**
   * Current working directory
   * @default process.cwd()
   */
  cwd?: string;
  /**
   * Options forwarded to esbuild
   * @see https://esbuild.github.io/
   */
  esbuildOptions?: CompileOptions['esbuildOptions'];
  /**
   * Extract .css bundle to a specified filename
   * @default false
   */
  extract?:
    | {
        /**
         * Name of emitted .css file.
         * @default "bundle.css"
         */
        name?: string;
        /**
         * Generate a .css.map file?
         * @default false
         */
        sourcemap?: boolean;
      }
    | false;
}

export function vanillaExtractPlugin({
  identifiers,
  cwd = process.cwd(),
  esbuildOptions,
  extract = false,
}: Options = {}): Plugin {
  const isProduction = process.env.NODE_ENV === 'production';

  let extractedCssIds = new Set<string>(); // only for `extract`

  return {
    name: 'vanilla-extract',

    buildStart() {
      extractedCssIds = new Set(); // refresh every build
    },

    // Transform .css.js to .js
    async transform(_code, id) {
      if (!cssFileFilter.test(id)) {
        return null;
      }

      const [filePath] = id.split('?');

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
        if (resolution.meta.css && !extract) {
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
        map: null,
      };
    },

    // Generate bundle (if extracting)
    async buildEnd() {
      if (!extract) {
        return;
      }
      // Note: generateBundle() can’t happen earlier than buildEnd
      // because the graph hasn’t fully settled until this point.
      const { bundle, extractedCssIds: extractedIds } = generateCssBundle(this);
      extractedCssIds = extractedIds;
      const name = extract.name || 'bundle.css';
      this.emitFile({
        type: 'asset',
        fileName: name,
        source: bundle.toString(),
      });
      if (extract.sourcemap) {
        this.emitFile({
          type: 'asset',
          fileName: `${name}.map`,
          source: bundle.generateMap({ file: extract.name }).toString(),
        });
      }
    },

    // Remove side effect imports (if extracting)
    async generateBundle(_options, bundle) {
      if (!extract) {
        return;
      }
      await Promise.all(
        Object.entries(bundle).map(async ([id, chunk]) => {
          if (
            chunk.type === 'chunk' &&
            id.endsWith('.js') &&
            chunk.imports.some((specifier) => extractedCssIds.has(specifier))
          ) {
            chunk.code = await stripSideEffectImportsMatching(chunk.code, [
              ...extractedCssIds,
            ]);
          }
        }),
      );
    },
  };
}
