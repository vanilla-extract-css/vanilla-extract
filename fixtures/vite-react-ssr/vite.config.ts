import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import ve from '@vanilla-extract/vite-plugin';
import int from '@vanilla-extract/integration';
import resolveFrom from 'resolve-from';
import { dirname } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ve.vanillaExtractPlugin({ unstable_mode: 'inlineCssInDev' }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'fix-vite-vanilla-extract-dep-scan',
          setup(build) {
            build.onResolve(
              { filter: int.cssFileFilter },
              async ({ importer, path }) => ({
                path: resolveFrom(dirname(importer), path),
                external: true,
              }),
            );
          },
        },
      ],
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      process.env.NODE_ENV || 'development',
    ),
  },
});
