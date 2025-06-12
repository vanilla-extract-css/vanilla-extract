---
'@vanilla-extract/babel-plugin-debug-ids': patch
'@vanilla-extract/parcel-transformer': patch
'@vanilla-extract/esbuild-plugin': patch
'@vanilla-extract/jest-transform': patch
'@vanilla-extract/webpack-plugin': patch
'@vanilla-extract/rollup-plugin': patch
'@vanilla-extract/next-plugin': patch
'@vanilla-extract/vite-plugin': patch
'@vanilla-extract/sprinkles': patch
'@vanilla-extract/compiler': patch
'@vanilla-extract/dynamic': patch
'@vanilla-extract/private': patch
'@vanilla-extract/recipes': patch
'@vanilla-extract/css-utils': patch
'@vanilla-extract/css': patch
---

Revert "Improve ESM package entrypoints (#1597)" to fix `Named export not found` error when importing ESM entrypoints
