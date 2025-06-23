---
'@vanilla-extract/vite-plugin': patch
---

Don't watch files or invalidate VE modules during SSR

Fixes a bug where a dependent of a Vanilla Extract module could be evaulated multiple times during `ssrLoadModule`, potentially causing bugs with singleton variables such as React context.
