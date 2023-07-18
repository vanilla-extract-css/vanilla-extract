import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  define: {
    'process.env': {},
  },
  // build: {
  //   lib: {
  //     entry: 'src/client.ts',
  //     name: 'vanilla-playground'
  //   }
  // },
  build: {
    // minify: false,
  },
  resolve: {
    alias: {
      'require-like': './src/shims/require-like.cjs',
    },
  },
  optimizeDeps: {
    include: ['./src/shims/require-like.cjs'],
    force: true,
  },
  plugins: [
    nodePolyfills(),
    {
      name: 'override-polyfill-aliases',
      config(config) {
        Object.assign(config.resolve!.alias!, {
          module: './src/shims/module.cjs',
          'node:module': './src/shims/module.cjs',
        });
        return config;
      },
    },
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/esbuild-wasm/esbuild.wasm',
          dest: './node_modules/esbuild-wasm/',
        },
      ],
    }),
  ],
});
