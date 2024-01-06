---
'@vanilla-extract/vite-plugin': major
---

The behaviour previously known as `emitCssInSsr` has been turned on by default. The `emitCssInSsr` option has been removed.

This means that the CSS emitted by the plugin is now processed by Vite, so the plugin no longer needs to resolve PostCSS plugins and process the CSS output itself.

Users can opt into the old behaviour by setting `mode: "transform"`.
