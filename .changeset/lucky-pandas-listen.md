---
'@vanilla-extract/turbopack-plugin': patch
---

Stop invalidating the compiler's module graph on every file during production builds

Production builds now reuse the shared compiler's module graph across files instead of dropping it before each one. On an app with 634 `.css.ts` files, this cut time spent in the loader from 256s to 84s and total Turbopack compile time by a third, with byte-identical CSS output.

Development builds are unaffected: the file watcher is disabled there, so the manual invalidation is still required to pick up edits between loader invocations.
