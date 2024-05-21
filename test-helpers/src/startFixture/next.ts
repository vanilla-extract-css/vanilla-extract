import type {
  NextServer,
  NextServerOptions,
} from '@fixtures/next-pages-router/node_modules/next/dist/server/next';
import { existsSync } from 'fs';
import { Server as _Server, createServer } from 'http';
import path from 'path';

import { TestServer } from './types';
import { serveAssets } from './vite';

type Server = _Server & {
  __app?: NextServer;
};

const DIST_DIR = 'dist';

// these are the fixtures that are currently
// configured as routes in the @fixtures/next-* apps
export const nextFixtures = ['sprinkles', 'recipes', 'features'] as const;

export interface NextFixtureOptions {
  type: 'next-app-router' | 'next-pages-router';
  mode?: 'development' | 'production';
  port: number;
}

const startNextServer = async (app: NextServer) => {
  await app.prepare();
  const handler = app.getRequestHandler();
  const server = createServer(handler) as Server;
  server['__app'] = app;

  server.listen(app.port, () => {
    console.log(`> Next ready on http://${app.hostname}:${app.port}`);
  });

  return server;
};

const stopNextApp = async (server: Server) => {
  if (server['__app']) {
    await server['__app'].close();
  }

  await new Promise<void>((resolve) => {
    server.close(() => {
      resolve();
    });
  });
};

const startNextApp = async (
  options: NextServerOptions,
  type: NextFixtureOptions['type'],
) => {
  const { dir, dev } = options;

  const nextServer = await import(
    path.join(dir!, 'node_modules', 'next', 'dist', 'server', 'next')
  );

  if (!dev) {
    const buildId = existsSync(path.join(dir!, DIST_DIR, 'BUILD_ID'));

    if (!buildId) {
      throw new Error(`No production build found for ${type} in ${dir}/${DIST_DIR}
      Please run pnpm test:build-next from the root.`);
    }
  }

  const app = nextServer.default(options) as NextServer;

  const server = await startNextServer(app);
  return server;
};

const getNextDir = (type: NextFixtureOptions['type']) =>
  path.dirname(require.resolve(`@fixtures/${type}/package.json`));

export const startNextFixture = async ({
  type,
  mode = 'development',
  port = 3000,
}: NextFixtureOptions): Promise<TestServer> => {
  const dev = mode !== 'production';
  const hostname = 'localhost';
  const url = `http://${hostname}:${port}`;

  const nextDir = getNextDir(type);

  // using export mode for production build in next 13
  // due to issues with the distDir config not being set
  // properly.
  if (!dev && type === 'next-app-router') {
    // Use vite to server the static build.
    const closeServer = await serveAssets({
      port,
      dir: path.join(nextDir, DIST_DIR),
    });
    return {
      type,
      url,
      close: closeServer,
    };
  }

  process.env.NODE_ENV = mode;

  const nextConfig = await import(path.join(nextDir, 'next.config.js'));

  const options: NextServerOptions = {
    dir: nextDir,
    dev,
    port,
    hostname,
    quiet: true,
    conf: {
      // we need to differentiate prod and dev folders
      // so they don't overwrite eachother when running tests
      ...nextConfig.default,
      distDir: dev ? '.next' : DIST_DIR,
    },
  };

  const server = await startNextApp(options, type);

  return {
    type,
    url,
    close: async () => await stopNextApp(server),
  };
};
