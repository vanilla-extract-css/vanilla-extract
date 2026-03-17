import { defineConfig } from 'vitest/config';
import { vanillaExtractPlugin } from './packages/vite-plugin';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      unstable_mode: 'transform',
    }),
  ],
});
