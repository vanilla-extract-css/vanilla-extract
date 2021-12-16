---
'@vanilla-extract/vite-plugin': patch
---

Fix compatibility issues with vite@2.7

Vite 2.7 introduced some [breaking changes](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#270-2021-12-07) around the way SSR was indicated in plugins.
The plugin has been updated to handle both the old and new formats, so it should support both 2.7 forward, as well as previous versions.