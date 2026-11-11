---
'@vanilla-extract/vite-plugin': patch
---

Fix `No CSS for file` error during SSR when the Vite root's directory name matches a top-level directory inside the project, e.g. a root of `/app` with an `app` directory
