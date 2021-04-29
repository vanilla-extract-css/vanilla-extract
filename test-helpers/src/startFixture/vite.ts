import path from 'path';
import { createServer } from 'vite';

import { TestServer } from './types';
export interface ViteFixtureOptions {
  type: 'vite';
  mode?: 'development' | 'production';
  port: number;
}
export const startViteFixture = async (
  fixtureName: string,
  { mode = 'development', port = 3000 }: ViteFixtureOptions,
): Promise<TestServer> => {
  const root = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    mode,
    root,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port,
    },
  });

  await server.listen();

  return {
    type: 'vite',
    url: `http://localhost:${port}`,
    close: () => {
      return server.close();
    },
  };
};
