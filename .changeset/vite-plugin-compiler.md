---
'@vanilla-extract/vite-plugin': major
---

The Vite plugin now uses a newer, faster, Vite-based compiler by default.

The new compiler uses [`vite-node`](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node) to parse and extract CSS from `.css.ts` files. This comes with all the benefits of using Vite, faster builds and the ability to use Vite plugins.

The new compiler has been used in Remix ever since support for Vanilla Extract was introduced.
