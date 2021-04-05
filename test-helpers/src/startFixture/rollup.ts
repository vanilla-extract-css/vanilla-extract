import path from 'path';
import { promises as fs } from 'fs';

import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { rollup, Plugin } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjsPlugin from '@rollup/plugin-commonjs';
import replacePlugin from 'rollup-plugin-replace';
import typescriptPlugin from '@rollup/plugin-typescript';
import jsonPlugin from '@rollup/plugin-json';
// @ts-expect-error
import servePlugin from 'rollup-plugin-serve';

import { TestServer } from './types';

interface FilescopePluginOptions {
  projectRoot?: string;
}
const vanillaExtractFilescopePlugin = ({
  projectRoot,
}: FilescopePluginOptions = {}): Plugin => ({
  name: 'vanilla-extract-filescope',
  transform(code, id) {
    if (
      code.indexOf('@vanilla-extract/css') > 0 &&
      code.indexOf('@vanilla-extract/css/fileScope') === -1
    ) {
      const fileScope = projectRoot ? path.relative(projectRoot, id) : id;

      return `
        import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
        setFileScope("${fileScope}");
        ${code}
        endFileScope()
      `;
    }
  },
});

export interface RollupFixtureOptions {
  type: 'rollup';
  mode?: 'development' | 'production';
  port: number;
}
export const startRollupFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: RollupFixtureOptions,
): Promise<TestServer> => {
  const entry = require.resolve(`@fixtures/${fixtureName}`);
  const projectRoot = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const outdir = path.join(projectRoot, 'dist');

  const bundle = await rollup({
    input: entry,
    plugins: [
      resolvePlugin({
        browser: true,
      }),
      commonjsPlugin(),
      replacePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      typescriptPlugin({
        tsconfig: path.resolve(__dirname, '../../../tsconfig.rollup.json'),
      }),
      jsonPlugin(),
      // vanillaExtractFilescopePlugin({ projectRoot }),
      vanillaExtractPlugin({
        projectRoot,
        fileName: 'index.css',
        plugins: [
          resolvePlugin(),
          commonjsPlugin(),
          replacePlugin({
            'process.env.NODE_ENV': JSON.stringify(mode),
          }),
          typescriptPlugin({
            tsconfig: path.resolve(__dirname, '../../../tsconfig.rollup.json'),
          }),
          jsonPlugin(),
        ],
      }),
      servePlugin({
        contentBase: outdir,
        host: 'localhost',
        port,
        // onListening(server: any) {
        //   resolvePromise(server);
        // },
      }),
    ],
  });
  // });

  await bundle.write({
    file: path.join(outdir, 'bundle.js'),
    format: 'iife',
  });

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>rollup - ${fixtureName}</title>
      <link rel="stylesheet" type="text/css" href="index.css" />
      </head>
    <body>
      <script src="bundle.js"></script>
    </body>
    </html>
  `,
  );

  return {
    type: 'rollup',
    url: `http://localhost:${port}`,
    close: () => {
      // server.stop()

      return Promise.resolve();
    },
  };
};
