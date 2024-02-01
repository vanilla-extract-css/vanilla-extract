---
'@vanilla-extract/vite-plugin': patch
---

Pass Vite `resolve` config to vite-node compiler

The plugin passes through the project's Vite `resolve` config to the vite-node compiler, which will be used for resolving imports. These options include [`resolve.alias`], [`resolve.dedupe`], [`resolve.conditions`], [`resolve.mainFields`], [`resolve.extensions`], and others.

[`resolve.alias`]: https://vitejs.dev/config/shared-options.html#resolve-alias
[`resolve.dedupe`]: https://vitejs.dev/config/shared-options.html#resolve-dedupe
[`resolve.conditions`]: https://vitejs.dev/config/shared-options.html#resolve-conditions
[`resolve.mainFields`]: https://vitejs.dev/config/shared-options.html#resolve-mainfields
[`resolve.extensions`]: https://vitejs.dev/config/shared-options.html#resolve-extensions
