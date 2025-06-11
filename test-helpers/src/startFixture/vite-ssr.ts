import path from 'path';
import fs from 'node:fs/promises';
import express, { type Express } from 'express';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import inspect from 'vite-plugin-inspect';

import type { TestServer } from './types';

const serveAssets = ({ app, port }: { app: Express; port: number }) =>
  new Promise<() => Promise<void>>((resolve) => {
    const server = app.listen(port, () => {
      resolve(
        () =>
          new Promise<void>((closeRes) => {
            server.close(() => closeRes());
          }),
      );
    });
  });

export interface ViteSsrFixtureOptions {
  type: 'vite-ssr';
  mode?: 'development' | 'production';
  port: number;
  inlineCssInDev?: boolean;
}
export const startViteSsrFixture = async (
  fixtureName: 'vite-react-ssr',
  { mode = 'development', port = 3000, inlineCssInDev }: ViteSsrFixtureOptions,
): Promise<TestServer> => {
  const root = path.dirname(
    require.resolve(`@fixtures/${fixtureName}/package.json`),
  );
  await import(path.join(root, 'server.js'));
  // const isProduction = mode === 'production';
  // const base = '/';
  //
  // const templateHtml = isProduction
  //   ? await fs.readFile(path.join(root, './dist/client/index.html'), 'utf-8')
  //   : '';
  //
  // const app = express();
  //
  // // Add Vite or respective production middlewares
  // /** @type {import('vite').ViteDevServer | undefined} */
  // let vite: import('vite').ViteDevServer | undefined;
  // if (!isProduction) {
  //   const { createServer } = await import('vite');
  //   vite = await createServer({
  //     server: { middlewareMode: true },
  //     appType: 'custom',
  //     root,
  //     base,
  //     plugins: [
  //       vanillaExtractPlugin({
  //         unstable_mode: inlineCssInDev ? 'inlineCssInDev' : undefined,
  //       }),
  //       mode === 'development' && inspect(),
  //     ],
  //   });
  //   app.use(vite.middlewares);
  // } else {
  //   const { build } = await import('vite');
  //   await build({
  //     build: {
  //       rollupOptions: { input: path.join(root, 'src', 'html.ts') },
  //       ssr: true,
  //       outDir: path.join(root, 'dist', 'server'),
  //     },
  //   });
  //   const compression = (await import('compression')).default;
  //   const sirv = (await import('sirv')).default;
  //   app.use(compression());
  //   app.use(base, sirv('./dist/client', { extensions: [] }));
  // }
  //
  // // Serve HTML
  // app.use('*all', async (req, res) => {
  //   try {
  //     const url = req.originalUrl.replace(base, '');
  //
  //     let template: string | undefined;
  //     let appHtml: string;
  //     if (!isProduction) {
  //       // Always read fresh template in development
  //       template = await fs.readFile(path.join(root, 'index.html'), 'utf-8');
  //       appHtml = (await vite?.ssrLoadModule?.('/src/html.ts'))?.default;
  //       template = await vite?.transformIndexHtml(url, template);
  //     } else {
  //       template = templateHtml;
  //       appHtml = (await import(path.join(root, './dist/server/html.js')))
  //         .default;
  //     }
  //
  //     const html = template
  //       // Currently no head tags are rendered, but leaving this here for future use
  //       ?.replace(`<!--app-head-->`, '')
  //       ?.replace(`<!--app-html-->`, appHtml ?? '');
  //
  //     res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  //   } catch (e: any) {
  //     vite?.ssrFixStacktrace(e);
  //     console.log(e.stack);
  //     res.status(500).end(e.stack);
  //   }
  // });
  //
  // const close = await serveAssets({ app, port });

  return {
    type: 'vite-ssr',
    close: () => {},
    url: `http://localhost:${port}`,
    // TODO: stylesheet
  };
};
