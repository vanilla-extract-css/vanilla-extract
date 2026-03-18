---
'@vanilla-extract/rollup-plugin': patch
---

Fixed a bug where side-effect imports would not be stripped in `.cjs` or `.mjs` files when bundling CSS with the `extract` option
