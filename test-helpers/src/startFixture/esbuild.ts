import path from 'path';
import { promises as fs } from 'fs';

import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';
import { serve } from 'esbuild';

import { TestServer } from './types';

export interface EsbuildFixtureOptions {
  type: 'esbuild';
  mode?: 'development' | 'production';
  port: number;
}
export const startEsbuildFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: EsbuildFixtureOptions,
): Promise<TestServer> => {
  const entry = require.resolve(`@fixtures/${fixtureName}`);
  const projectRoot = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const outdir = path.join(projectRoot, 'dist');

  const server = await serve(
    { servedir: outdir, port },
    {
      entryPoints: [entry],
      metafile: true,
      platform: 'browser',
      bundle: true,
      minify: mode === 'production',
      plugins: [vanillaExtractPlugin({ projectRoot })],
      outdir,
    },
  );

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>esbuild - ${fixtureName}</title>
      <link rel="stylesheet" type="text/css" href="index.css" />
      </head>
    <body>
      <script src="index.js"></script>
    </body>
    </html>
  `,
  );

  return {
    type: 'esbuild',
    url: `http://localhost:${port}`,
    close: () => {
      server.stop();

      return Promise.resolve();
    },
  };
};
