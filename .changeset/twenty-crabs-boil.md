---
'@vanilla-extract/integration': patch
'@vanilla-extract/rollup-plugin': patch
'@vanilla-extract/vite-plugin': patch
'@vanilla-extract/webpack-plugin': patch
'@vanilla-extract/esbuild-plugin': patch
---

Fix issue where `.css.ts` files with the same file path from other packages could have identifier collisions
