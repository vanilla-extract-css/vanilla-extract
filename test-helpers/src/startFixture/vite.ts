import path from 'path';
import http from 'http';

import type { InlineConfig } from 'vite';
import handler from 'serve-handler';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import inspect from 'vite-plugin-inspect';

import type { TestServer } from './types';
import { createOutputDir } from './outputDir';

export const serveAssets = ({ port, dir }: { port: number; dir: string }) =>
  new Promise<() => Promise<void>>((resolve) => {
    const server = http.createServer((request, response) => {
      return handler(request, response, {
        public: dir,
      });
    });

    server.listen(port, () => {
      resolve(
        () =>
          new Promise<void>((closeRes) => {
            server.close(() => closeRes());
          }),
      );
    });
  });

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

  const config: InlineConfig = {
    configFile: false,
    root,
    logLevel: 'error',
    plugins: [vanillaExtractPlugin(), mode === 'development' && inspect()],
    server: {
      port,
      strictPort: true,
    },
    build: {
      cssCodeSplit: false,
      minify: false,
    },
  };

  const { createServer, build } = await import('vite');

  if (mode === 'development') {
    const server = await createServer(config);

    await server.listen();

    return {
      type: 'vite',
      url: `http://localhost:${port}`,
      close: () => {
        return server.close();
      },
    };
  }

  const { outputDir, removeOutputDir } = await createOutputDir(
    fixtureName,
    'vite-production',
  );
  const result = await build({
    ...config,
    build: { ...config.build, outDir: outputDir },
  });
  const closeServer = await serveAssets({ port, dir: outputDir });

  if (!('output' in result)) {
    throw new Error('Unexpected build output');
  }

  const { fileName: stylesheet } =
    result.output.find((asset) => asset.name?.endsWith('.css')) || {};

  return {
    type: 'vite',
    url: `http://localhost:${port}`,
    stylesheet,
    close: async () => {
      await closeServer();
      await removeOutputDir();
    },
  };
};
