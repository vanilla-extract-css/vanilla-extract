---
'@vanilla-extract/recipes': patch
---

Allow explicit false variants.

Boolean variants in recipes can now also have a `false` case, which is handled properly by the type system and the build system.