import path from 'path';

import { Parcel } from '@parcel/core';

import type { TestServer } from './types';

export interface ParcelFixtureOptions {
  type: 'parcel';
  mode?: 'development' | 'production';
  port: number;
}
export const startParcelFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: ParcelFixtureOptions,
): Promise<TestServer> => {
  const entry = require.resolve(`@fixtures/${fixtureName}/index.html`);
  const absWorkingDir = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const distDir = path.join(absWorkingDir, 'dist');

  const bundler = new Parcel({
    entries: entry,
    mode,
    config: require.resolve('./parcel-config.json'),
    serveOptions: {
      port,
    },
    defaultTargetOptions: {
      distDir,
      shouldOptimize: false,
    },
    shouldDisableCache: true,
    logLevel: 'verbose',
  });

  return new Promise(async (resolve, reject) => {
    const subscription = await bundler.watch((err, buildEvent) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      if (buildEvent?.type === 'buildFailure') {
        console.error('Build event diagnostics:', buildEvent.diagnostics);
        return reject(buildEvent.diagnostics[0]);
      }

      if (buildEvent?.type === 'buildSuccess') {
        const cssBundle = buildEvent.bundleGraph
          .getBundles()
          .find((bundle) => bundle.type === 'css');

        const stylesheet = cssBundle?.filePath.substring(distDir.length + 1);

        resolve({
          type: 'parcel',
          url: `http://localhost:${port}`,
          stylesheet,
          close: async () => {
            await subscription.unsubscribe();
          },
        });
      }
    });
  });
};
