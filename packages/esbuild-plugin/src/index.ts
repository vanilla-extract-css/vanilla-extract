import { dirname, join } from 'path';

import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  compile,
  vanillaExtractTransformPlugin,
  type IdentifierOption,
  type CompileOptions,
  hash,
} from '@vanilla-extract/integration';
import type { Plugin } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  inlineCss?: boolean;
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
  inlineCss,
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
          if (inlineCss) {
            const id = `css_${hash(source)}`;
            const injectStyles = String.raw`
              var css = ${JSON.stringify(source)}
              var style = document.getElementById('${id}');
              if (!style) {
                style = document.createElement("style");
                style.id = "${id}";
                style.setAttribute("type", "text/css");
                document.head.appendChild(style);
              }
              style.innerHTML = css;
            `
            return {
              contents: injectStyles,
              loader: 'js'
            }
          } else {
            const rootDir = build.initialOptions.absWorkingDir ?? process.cwd();

            const resolveDir = dirname(join(rootDir, fileName));

            return {
              contents: source,
              loader: 'css',
              resolveDir,
            };
          }
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const combinedEsbuildOptions = { ...esbuildOptions };
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
