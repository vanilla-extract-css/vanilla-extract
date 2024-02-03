---
'@vanilla-extract/vite-plugin': patch
---

Don't pass Remix Vite plugin to the vite-node compiler

Remix throws an error if it's loaded without a config file, which is what we do when we initialise the vite-node compiler.
