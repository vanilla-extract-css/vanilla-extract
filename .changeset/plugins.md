---
'@vanilla-extract/vite-plugin': patch
'@vanilla-extract/esbuild-plugin-next': patch
---

Correctly resolve module paths when using Vite plugins that affect module resolution, such as [`vite-tsconfig-paths`](https://github.com/aleclarson/vite-tsconfig-paths)
