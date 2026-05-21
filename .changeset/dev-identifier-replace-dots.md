---
'@vanilla-extract/css': patch
---

Replace dots with underscores in development mode identifiers

Dev mode debug identifiers are derived from the source file name. For file names with additional extensions (e.g. `foo.vanilla.css.ts`), the resulting class names contained a literal `.`, which is a CSS selector metacharacter that requires escaping and is a source of instability. Dots in the debug file name segment are now replaced with `_`. This only affects the debug/dev identifier path and not production hashes.
