---
'@vanilla-extract/rollup-plugin': minor
---

Add optional `unstable_injectFilescopes` flag

The `unstable_injectFilescopes` flag injects filescopes into Vanilla Extract modules instead of generating CSS. This is useful for utility or component libraries that prefer their consumers to process Vanilla Extract files instead of bundling CSS.

Note that this flag only works with `preserveModules: true`.
