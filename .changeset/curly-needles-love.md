---
'@vanilla-extract/vite-plugin': minor
---

Add postcss processing to the plugin

Vite supports postcss processing as a built in feature, but that's lost in dev mode with vanilla-extract because there are no actual css files for vite to pick up.

The vite plugin now manually runs postcss over the generated css in serve mode, if any postcss config was found.