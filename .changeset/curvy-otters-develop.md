---
'@vanilla-extract/vite-plugin': patch
---

Fix HMR issue when using `devStyleRuntime: 'vanilla-extract'`

Styles would not hot reload correctly when returning to a previously cached version
