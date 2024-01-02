---
'@vanilla-extract/vite-plugin': minor
---

`emitCssInSsr` is now on by default.

This means that the CSS emitted by the plugin is now processed by Vite, so we no longer need to resolve PostCSS plugins and process it ourselves.

Users can opt into the old/current behaviour by explicitly setting `emitCssInSsr` to `false`.
