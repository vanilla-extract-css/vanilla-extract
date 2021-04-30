import { dirname, relative } from 'path';
import { promises as fs } from 'fs';

import {
  cssFileFilter,
  virtualCssFileFilter,
  processVanillaFile,
  getSourceFromVirtualCssFile,
  getPackageInfo,
} from '@vanilla-extract/integration';
import { build as esbuild, Plugin } from 'esbuild';

const vanillaCssNamespace = 'vanilla-extract-css-ns';

export const vanillaExtractFilescopePlugin = (): Plugin => ({
  name: 'vanilla-extract-filescope',
  setup(build) {
    const packageInfo = getPackageInfo(build.initialOptions.absWorkingDir);

    build.onLoad({ filter: cssFileFilter }, async ({ path }) => {
      const originalSource = await fs.readFile(path, 'utf-8');

      if (originalSource.indexOf('@vanilla-extract/css/fileScope') === -1) {
        const filePath = relative(packageInfo.dirname, path);

        const contents = `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${filePath}", "${packageInfo.name}");
        ${originalSource}
        endFileScope()
        `;

        return {
          contents,
          loader: path.match(/\.(ts|tsx)$/i) ? 'ts' : undefined,
          resolveDir: dirname(path),
        };
      }
    });
  },
});

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
        const result = await esbuild({
          entryPoints: [path],
          metafile: true,
          bundle: true,
          external: ['@vanilla-extract', ...externals],
          platform: 'node',
          write: false,
          plugins: [vanillaExtractFilescopePlugin()],
          absWorkingDir: build.initialOptions.absWorkingDir,
        });

        const { outputFiles, metafile } = result;

        if (!outputFiles || outputFiles.length !== 1) {
          throw new Error('Invalid child compilation');
        }

        const contents = processVanillaFile({
          source: outputFiles[0].text,
          filePath: path,
          outputCss,
        });

        return {
          contents,
          loader: 'js',
          watchFiles: Object.keys(metafile?.inputs || {}),
        };
      });
    },
  };
}
