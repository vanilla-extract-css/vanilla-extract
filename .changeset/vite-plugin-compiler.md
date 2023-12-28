---
'@vanilla-extract/vite-plugin': minor
---

The Vite plugin can be configured to use the new compiler by setting `emitCssInSsr: "compiler"`.

The `@vanilla-extract/esbuild-plugin-next` package (providing support for Vanilla Extract in Remix) has been using the new compiler for a while now.

The new compiler is faster and uses [`vite-node`](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node) to parse and extract CSS from `.css.ts` files. This comes with all the benefits of using Vite, faster builds and the ability to use Vite plugins.

**Example usage**

```ts
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      emitCssInSsr: 'compiler'
    })
  ]
});
```
