---
'@vanilla-extract/vite-plugin': patch
---

Fix vite plugin for watch mode.

The vite plugin previously relied on a one to one matching of resolve to load calls, and would clean up the CSS stored in memory after it was loaded.

This isn't true in `--watch` mode, as the same file can be loaded on the rebuild without having to be resolved, which the plugin now handles.