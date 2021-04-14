---
'@vanilla-extract/babel-plugin': patch
'@vanilla-extract/esbuild-plugin': patch
---

Fix hash context information not being applied

This change makes it so all files with a valid CSS file extension (e.g. `.css.ts`) get hash context information (internally referred to as `filescope`) applied. This fixes some situations where the "New styles cannot be registered dynamically after initial boot" error would occur incorrectly.
