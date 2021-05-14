import path from 'path';

import { createConfiguration, startServer } from 'snowpack';

import { TestServer } from './types';

export interface SnowpackFixtureOptions {
  type: 'snowpack';
  mode?: 'development' | 'production';
  port: number;
}
export const startSnowpackFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: SnowpackFixtureOptions,
): Promise<TestServer> => {
  const root = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );

  const config = createConfiguration({
    mode,
    root,
    workspaceRoot: path.dirname(require.resolve(`../../../package.json`)),
    devOptions: {
      port,
    },
    plugins: ['@vanilla-extract/snowpack-plugin'],
    mount: {
      'snowpack-public': { url: '/', static: true },
      src: { url: '/dist' },
    },
  });

  const server = await startServer({ config });

  return {
    type: 'snowpack',
    url: `http://localhost:${port}`,
    close: () => {
      return server.shutdown();
    },
  };
};
