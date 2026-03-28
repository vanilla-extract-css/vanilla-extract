import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from './packages/vite-plugin/src/index.ts';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      unstable_mode: 'transform',
    }),
  ],
  resolve: {
    conditions: ['@vanilla-extract/source'],
  },
});
