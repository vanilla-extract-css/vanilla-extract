import { dirname, posix } from 'path';

import {
  cssFileFilter,
  createCompiler,
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
    async setup(build) {
      const root = build.initialOptions.absWorkingDir!;

      const compiler = createCompiler({
        root,
        toCssImport(filePath) {
          return posix.relative(root, filePath) + '.vanilla.css';
        },
      });

      build.onResolve({ filter: /\.vanilla\.css/ }, (args) => {
        return {
          path: args.path,
          namespace: vanillaCssNamespace,
        };
      });

      build.onLoad(
        { filter: /.*/, namespace: vanillaCssNamespace },
        async ({ path }) => {
          const [relativeFilePath] = path.split('.vanilla.css');

          const { css, filePath } = compiler.getCssForFile(
            posix.join(root, relativeFilePath),
          );

          // if (typeof processCss === 'function') {
          //   source = await processCss(source);
          // }

          return {
            contents: css,
            loader: 'css',
            resolveDir: dirname(filePath),
          };
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const { source, watchFiles } = await compiler.processVanillaFile(
          path,
          build.initialOptions.platform === 'browser',
        );

        return {
          contents: source,
          loader: 'js',
          watchFiles: Array.from(watchFiles),
        };
      });
    },
  };
}
