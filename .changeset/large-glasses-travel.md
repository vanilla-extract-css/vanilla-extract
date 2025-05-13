---
'@vanilla-extract/compiler': patch
'@vanilla-extract/vite-plugin': patch
---

Ignore Vite `base` config

Fixes a bug where imported asset URLs would be transformed by the compiler when setting the `base` option in Vite, resulting in incorrect resolution and bundling of these assets during the build process.
