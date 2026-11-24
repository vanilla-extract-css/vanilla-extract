import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { satteri } from '@astrojs/markdown-satteri';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { docsIntegration, docsPlugin } from './src/markdown/docsPlugin';

export default defineConfig({
  site: 'https://vanilla-extract.style',
  server: { port: 8080 },
  redirects: {
    '/documentation/styling-api': '/documentation/styling/',
    '/documentation/sprinkles-api/': '/documentation/packages/sprinkles/',
    '/documentation/recipes-api/': '/documentation/packages/recipes/',
    '/documentation/dynamic-api/': '/documentation/packages/dynamic/',
    '/documentation/utility-functions/': '/documentation/packages/css-utils/',
    '/documentation/setup/':
      '/documentation/getting-started/#bundler-integration',
  },
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    mdx({ processor: satteri({ mdastPlugins: [docsPlugin()] }) }),
    react(),
    docsIntegration(),
  ],
  vite: {
    plugins: [
      vanillaExtractPlugin(),
      {
        name: 'bundle-docsearch',
        // DocSearch's ESM build and its Algolia dependencies can't be imported
        // by Node, so they're bundled for server rendering
        configEnvironment: (name) =>
          name === 'client'
            ? undefined
            : {
                resolve: {
                  noExternal: ['@docsearch/react', /^@algolia\//],
                },
              },
      },
    ],
  },
});
