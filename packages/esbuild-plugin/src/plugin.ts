import { dirname, join } from 'path';

import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  vanillaExtractTransformPlugin,
  IdentifierOption,
  CompileOptions,
} from '@vanilla-extract/integration';
import type { Plugin } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  /**
   * @deprecated Use `esbuildOptions.external` instead.
   */
  externals?: Array<string>;
  runtime?: boolean;
  processCss?: (css: string) => Promise<string>;
  identifiers?: IdentifierOption;
  esbuildOptions?: CompileOptions['esbuildOptions'];
}
export function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
  processCss,
  identifiers,
  esbuildOptions,
}: VanillaExtractPluginOptions = {}): Plugin {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes and debug IDs to code
    return vanillaExtractTransformPlugin({ identOption: identifiers });
  }

  return {
    name: 'vanilla-extract',
    setup(build) {
      build.onResolve({ filter: virtualCssFileFilter }, (args) => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace,
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: vanillaCssNamespace },
        async ({ path }) => {
          let { source, fileName } = await getSourceFromVirtualCssFile(path);

          if (typeof processCss === 'function') {
            source = await processCss(source);
          }

          const rootDir = build.initialOptions.absWorkingDir ?? process.cwd();

          const resolveDir = dirname(join(rootDir, fileName));

          return {
            contents: source,
            loader: 'css',
            resolveDir,
          };
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const combinedEsbuildOptions = { ...esbuildOptions } ?? {};
        const identOption =
          identifiers ?? (build.initialOptions.minify ? 'short' : 'debug');

        // To avoid a breaking change this combines the `external` option from
        // esbuildOptions with the pre-existing externals option.
        if (externals) {
          if (combinedEsbuildOptions.external) {
            combinedEsbuildOptions.external.push(...externals);
          } else {
            combinedEsbuildOptions.external = externals;
          }
        }

        const { source, watchFiles } = await compile({
          filePath: path,
          cwd: build.initialOptions.absWorkingDir,
          esbuildOptions: combinedEsbuildOptions,
          identOption,
        });

        const contents = await processVanillaFile({
          source,
          filePath: path,
          outputCss,
          identOption,
        });

        return {
          contents,
          loader: 'js',
          watchFiles,
        };
      });
    },
  };
}
