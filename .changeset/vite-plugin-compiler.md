---
'@vanilla-extract/vite-plugin': minor
---

The Vite plugin now uses a newer, faster, Vite-based compiler by default.

The new compiler uses [`vite-node`](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node) to parse and extract CSS from `.css.ts` files. This comes with all the benefits of using Vite, faster builds and the ability to use Vite plugins.

The `@vanilla-extract/esbuild-plugin-next` package (providing support for Vanilla Extract in Remix) has been using the new compiler for a while now.

The plugin can be configured to use the old/current esbuild-based compiler by setting `compiler: "esbuild"`.
