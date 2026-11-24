---
'@vanilla-extract/webpack-plugin': patch
---

Fix assets emitted while compiling `.css.ts` files (e.g. fonts imported via `asset/resource`) being missing from builds restored from webpack's persistent cache

Fixes an issue which caused `RealContentHashPlugin: "unexpected caching problem"` and `Conflict: Multiple assets emit different content to the same filename` errors in Next.js builds (e.g. for `middleware-manifest.json` or `../child.js.nft.json`)
