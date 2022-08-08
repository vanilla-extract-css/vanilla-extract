import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin({ identifiers: 'debug' })],
  test: {
    watch: false,
    snapshotFormat: {
      printBasicPrototype: true,
    },
  },
});
