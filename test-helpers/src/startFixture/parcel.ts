import path from 'path';

import { Parcel } from '@parcel/core';

import { TestServer } from './types';

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
    },
    logLevel: 'verbose',
  });

  const subscription = await bundler.watch((err) => {
    if (err) {
      console.error(err);
    }
  });

  return {
    type: 'parcel',
    url: `http://localhost:${port}`,
    stylesheet: 'index.css',
    close: async () => {
      await subscription.unsubscribe();
    },
  };
};
