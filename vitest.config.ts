import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  test: {
    watch: false,
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
});
