---
'@vanilla-extract/css': patch
---

Replace dots with underscores in development mode identifiers

Replace dots with underscores in `debug` identifiers

`debug` identifiers are derived from the source file path. For file paths with additional dots beyond the `.css.ts` extension (e.g. `foo.vanilla.css.ts`), the resulting class names contained a literal `.`, which is a CSS selector metacharacter that requires escaping and is a source of instability. Dots in debug identifiers are now replaced with `_`. This only affects `debug` identifiers and not `short` identifiers.
