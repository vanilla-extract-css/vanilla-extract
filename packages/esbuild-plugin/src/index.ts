import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  vanillaExtractFilescopePlugin,
} from '@vanilla-extract/integration';
import type { Plugin } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  externals?: Array<string>;
  runtime?: boolean;
}
export function vanillaExtractPlugin({
  outputCss,
  externals = [],
  runtime = false,
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
        ({ path }) => {
          const contents = getSourceFromVirtualCssFile(path);

          return {
            contents,
            loader: 'css',
          };
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const { source, watchFiles } = await compile({
          filePath: path,
          externals,
          cwd: build.initialOptions.absWorkingDir,
        });

        const contents = processVanillaFile({
          source,
          filePath: path,
          outputCss,
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
