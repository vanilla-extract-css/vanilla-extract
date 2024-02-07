import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { unstable_vitePlugin as remix } from '@remix-run/dev';

export default defineConfig({
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        ios_saf: 12,
      },
    },
  },
  plugins: [remix(), vanillaExtractPlugin()],
});
