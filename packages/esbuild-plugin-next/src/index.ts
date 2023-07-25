import { dirname } from 'path';

import {
  cssFileFilter,
  createCompiler,
  vanillaExtractTransformPlugin,
  IdentifierOption,
  CreateCompilerOptions,
} from '@vanilla-extract/integration';
import type { Plugin } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

async function hashString(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hash;
}

interface VanillaExtractPluginOptions {
  outputCss?: boolean;
  runtime?: boolean;
  processCss?: (css: string) => Promise<string>;
  identifiers?: IdentifierOption;
  compilerVitePlugins?: CreateCompilerOptions['vitePlugins'];
  useStyleLoader?: boolean;
}
export function vanillaExtractPlugin({
  outputCss = true,
  runtime = false,
  processCss,
  identifiers: identOption,
  compilerVitePlugins: vitePlugins,
  useStyleLoader,
}: VanillaExtractPluginOptions = {}): Plugin {
  if (runtime) {
    // If using runtime CSS then just apply fileScopes and debug IDs to code
    return vanillaExtractTransformPlugin({ identOption });
  }

  return {
    name: 'vanilla-extract',
    async setup(build) {
      const root = build.initialOptions.absWorkingDir || process.cwd();
      const identifiers =
        identOption || (build.initialOptions.minify ? 'short' : 'debug');

      const compiler = createCompiler({ root, identifiers, vitePlugins });

      build.onDispose(async () => {
        await compiler.close();
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
          const [rootRelativePath] = path.split('.vanilla.css');

          let { css, filePath } = compiler.getCssForFile(rootRelativePath);

          if (typeof processCss === 'function') {
            css = await processCss(css);
          }
          const resolveDir = dirname(filePath);

          if (useStyleLoader) {
            // replace slashes with dashes to make it a valid CSS identifier
            const elementId = `vanilla-extract-${
              build.initialOptions.minify
                ? await hashString(filePath)
                : filePath.replace(/\//g, '__')
            }`;
            const contents = `
              if (document.getElementById('${elementId}') === null) {
                const element = document.createElement('style');
                element.id = '${elementId}';
                element.textContent = \`${css}\`;
                document.head.append(element);
              }
              export default {};
              `;
            return {
              contents,
              loader: 'js',
              resolveDir,
            };
          }

          return {
            contents: css,
            loader: 'css',
            resolveDir,
          };
        },
      );

      build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
        const { source, watchFiles } = await compiler.processVanillaFile(path, {
          outputCss,
        });

        return {
          contents: source,
          loader: 'js',
          watchFiles: Array.from(watchFiles),
        };
      });
    },
  };
}
