---
'@vanilla-extract/vite-plugin': patch
---

Don't pass React-Router Vite plugin to the vite-node compiler


React-Router throws an error if it's loaded without a config file, which is what we do when we initialise the vite-node compiler.
