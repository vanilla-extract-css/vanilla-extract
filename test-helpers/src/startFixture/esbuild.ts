import path from 'path';
import { existsSync, promises as fs } from 'fs';

import {
  vanillaExtractPlugin,
  unstable_vanillaExtractPluginNext,
} from '@vanilla-extract/esbuild-plugin';
import { serve } from 'esbuild';

import { TestServer } from './types';

export interface EsbuildFixtureOptions {
  type: 'esbuild' | 'esbuild-runtime' | 'esbuild-next' | 'esbuild-next-runtime';
  mode?: 'development' | 'production';
  port: number;
}
export const startEsbuildFixture = async (
  fixtureName: string,
  { type, mode = 'development', port = 3000 }: EsbuildFixtureOptions,
): Promise<TestServer> => {
  const plugin = type.includes('next')
    ? unstable_vanillaExtractPluginNext
    : vanillaExtractPlugin;
  const entry = require.resolve(`@fixtures/${fixtureName}/src/index.ts`);
  const absWorkingDir = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const outdir = path.join(absWorkingDir, 'dist', type, fixtureName);

  if (existsSync(outdir)) {
    await fs.rm(outdir, { recursive: true });
  }

  await fs.mkdir(outdir, { recursive: true });

  const server = await serve(
    { servedir: outdir, port },
    {
      entryPoints: [entry],
      metafile: true,
      platform: 'browser',
      bundle: true,
      minify: mode === 'production',
      plugins: [
        plugin({
          runtime: type.includes('runtime'),
        }),
      ],
      absWorkingDir,
      outdir,
    },
  );

  await fs.writeFile(
    path.join(outdir, 'index.html'),
    `<!DOCTYPE html>
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
    url: `http://${server.host}:${port}`,
    stylesheet: 'index.css',
    close: () => {
      server.stop();

      return Promise.resolve();
    },
  };
};
