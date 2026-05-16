---
'@vanilla-extract/vite-plugin': patch
---

Fix `No CSS for file` error in Vite dev mode when virtual CSS modules are resolved through Vite's `@id/` id wrapper

This was most commonly hit with workspace `.css.ts` imports in pnpm monorepos on Windows, where Vite produces ids shaped like `@id/C:/...`, but it can also occur on macOS/Linux. The plugin now unwraps these ids before resolving the virtual CSS file so they map to the correct compiler cache entry.
