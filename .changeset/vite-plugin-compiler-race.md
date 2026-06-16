---
'@vanilla-extract/vite-plugin': patch
---

Fix a race condition that could leave `.css.ts` files untransformed

The compiler is created in `buildStart`, and `transform` previously bailed out (`return null`) if it ran before the compiler was ready. When another plugin emits an additional entry whose module graph is transformed concurrently (e.g. a module federation plugin exposing a module as its own chunk), a `transform` for a `.css.ts` could run before `buildStart` finished creating the compiler, leaving the file untransformed and producing runtime `style()` calls that throw `Styles were unable to be assigned to a file`.

Compiler creation is now memoized and awaited from `transform`, so it no longer depends on `buildStart` having already resolved.
