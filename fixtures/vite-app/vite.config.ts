import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';

const fixtures = [
  'features',
  'layers',
  'low-level',
  'recipes',
  'sprinkles',
  'themed',
  'thirdparty',
];

// Rewrite /{fixture}/ to /pages/{fixture}/ so pages can live
// in a subdirectory without affecting the public URL.
function fixtureRewritePlugin(): Plugin {
  const fixtureSet = new Set(fixtures);
  return {
    name: 'fixture-rewrite',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const match = req.url.match(/^\/([^/]+)(\/.*)?$/);
          if (match && fixtureSet.has(match[1])) {
            req.url = `/pages${req.url}`;
          }
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const match = req.url.match(/^\/([^/]+)(\/.*)?$/);
          if (match && fixtureSet.has(match[1])) {
            req.url = `/pages${req.url}`;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [vanillaExtractPlugin(), fixtureRewritePlugin()],
  build: {
    cssCodeSplit: false,
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ...Object.fromEntries(
          fixtures.map((f) => [f, resolve(__dirname, 'pages', f, 'index.html')]),
        ),
      },
    },
  },
});
