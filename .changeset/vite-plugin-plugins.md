---
'@vanilla-extract/vite-plugin': patch
---

Resolve and pass a new copy of the Vite config to the vite-node compiler

Previously, we were passing the same Vite config object to the vite-node compiler. This was causing compatibility issues with other plugins, such as Vitest and Remix.
