import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const resolveRelative = (p: string) => path.resolve(__dirname, p);

const WASM_URL = '/node_modules/esbuild-wasm/esbuild.wasm';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: () => false,
    },
    target: 'esnext',
  },
  define: {
    'window.WASM_URL': JSON.stringify(WASM_URL),
  },
  resolve: {
    alias: {
      // This is used by `node-eval`. The shim contains a module cache with `@vanilla-extract/*` deps required to compile user code.
      'require-like': resolveRelative('./src/shims/require-like.cjs'),
    },
  },
  optimizeDeps: {
    include: ['require-like'],
    force: true,
  },
  plugins: [
    nodePolyfills({
      overrides: {
        // `node-stdlib-browser` (used by `vite-plugin-node-polyfills`) aliases `node:module` to null.
        // We provide a minimal `node:module` shim so `mlly` doesn't crash.
        // https://github.com/unjs/mlly/blob/c5bcca0cda175921344fd6de1bc0c499e73e5dac/src/_utils.ts#L1-L3
        module: resolveRelative('./src/shims/module.cjs'),
      },
    }),
  ],
});
