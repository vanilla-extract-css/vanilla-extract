import { dirname, join } from 'path';

import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  vanillaExtractFilescopePlugin,
  IdentifierOption,
} from '@vanilla-extract/integration';
import type { Plugin, BuildOptions as EsbuildOptions } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  externals?: Array<string>;
  runtime?: boolean;
  processCss?: (css: string) => Promise<string>;
  identifiers?: IdentifierOption;
  internalEsbuildOptions?: EsbuildOptions;
}
export function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
  processCss,
  identifiers,
  internalEsbuildOptions,
}: VanillaExtractPluginOptions = {}): Plugin {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes to code
    return vanillaExtractFilescopePlugin();
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
        const { source, watchFiles } = await compile({
          filePath: path,
          externals,
          cwd: build.initialOptions.absWorkingDir,
          esbuildOptions: internalEsbuildOptions,
        });

        const contents = await processVanillaFile({
          source,
          filePath: path,
          outputCss,
          identOption:
            identifiers ?? (build.initialOptions.minify ? 'short' : 'debug'),
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
