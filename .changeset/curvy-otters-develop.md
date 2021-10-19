---
'@vanilla-extract/vite-plugin': patch
---

Fix HMR for pre-existing CSS

Previously, styles would not hot reload correctly when returning to a previously cached version
