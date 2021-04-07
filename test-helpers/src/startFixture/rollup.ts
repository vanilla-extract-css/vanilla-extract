import path from 'path';
import { promises as fs } from 'fs';

import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { rollup } from 'rollup';
import resolvePlugin from '@rollup/plugin-node-resolve';
import commonjsPlugin from '@rollup/plugin-commonjs';
import replacePlugin from 'rollup-plugin-replace';
import typescriptPlugin from '@rollup/plugin-typescript';
import jsonPlugin from '@rollup/plugin-json';
// @ts-expect-error
import servePlugin from 'rollup-plugin-serve';

import { TestServer } from './types';

export interface RollupFixtureOptions {
  type: 'rollup' | 'rollup-runtime';
  mode?: 'development' | 'production';
  port: number;
}
export const startRollupFixture = async (
  fixtureName: string,
  { type, mode = 'development', port = 3000 }: RollupFixtureOptions,
): Promise<TestServer> => {
  const entry = require.resolve(`@fixtures/${fixtureName}`);
  const projectRoot = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const outdir = path.join(projectRoot, 'dist');

  let server: any;
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
      vanillaExtractPlugin({
        runtime: type === 'rollup-runtime',
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
        onListening(s: any) {
          server = s;
        },
      }),
    ],
  });

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
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve());
      }),
  };
};
