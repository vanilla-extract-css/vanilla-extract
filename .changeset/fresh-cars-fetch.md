---
'@vanilla-extract/webpack-plugin': patch
'@vanilla-extract/next-plugin': patch
---

Fix `require is not defined` error in ESM bundles by calling `createRequire`
