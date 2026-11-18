---
'@vanilla-extract/vite-plugin': minor
---

Add an `extract` option to the Vite plugin, mirroring the Rollup plugin. CSS can be emitted as per-file assets (`extract: false`) or combined into a single plugin-emitted CSS bundle with side-effect imports stripped (`extract: { name, sourcemap }`). The default (`undefined`) keeps Vite's native CSS pipeline untouched.
