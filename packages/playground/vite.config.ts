import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  define: {
    process: {},
  },
  plugins: [nodePolyfills()],
});
