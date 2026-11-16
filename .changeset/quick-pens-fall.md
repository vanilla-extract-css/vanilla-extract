---
'@vanilla-extract/turbopack-plugin': patch
---

fix: Support Next.js 16.4+ when importing images from `.css.ts` files

Previously, builds failed with `TypeError: getImageSize is not a function`.
