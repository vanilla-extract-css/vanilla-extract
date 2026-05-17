---
'@vanilla-extract/css': patch
---

Fix a bug causing `fallbackVar` to discard an empty string passed as the fallback value

An empty string fallback was silently dropped, producing `var(--myVar)` instead of the CSS empty-fallback form `var(--myVar, )`. `fallbackVar` now treats `''` like any other fallback value.
