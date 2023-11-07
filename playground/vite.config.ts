import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  resolve: {
    alias: {
      // This is used by `node-eval`. The shim contains a module cache with `@vanilla-extract/*` deps required to compile user code.
      'require-like': './src/shims/require-like.cjs',
    },
  },
  optimizeDeps: {
    include: ['./src/shims/require-like.cjs'],
    force: true,
  },
  plugins: [
    nodePolyfills({
      overrides: {
        // `node-stdlib-browser` (used by `vite-plugin-node-polyfills`) aliases `node:module` to null.
        // We provide a minimal `node:module` shim so `mlly` doesn't crash.
        // https://github.com/unjs/mlly/blob/c5bcca0cda175921344fd6de1bc0c499e73e5dac/src/_utils.ts#L1-L3
        module: './src/shims/module.cjs',
      },
    }),
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
