---
'@vanilla-extract/vite-plugin': patch
---

Automatically optimize deps.

When using the new vanilla browser runtime, the new `injectStyles` dependency gets injected at runtime, so vite can't discover it ahead of time and pre-bundle it.

The plugin will now add the dependency to optimizeDeps if the vanilla runtime is being used so that it's optimized up front.
It also ensures that some relevant vanilla packages are externalised in SSR mode.