---
'@vanilla-extract/integration': minor
---

Add `createCompiler` function for creating a compiler instance that can be re-used between builds. This is a low-level function intended for use by bundler plugins and, as such, is currently undocumented. Note that in order to use the new compiler you must also update `@vanilla-extract/css` to v1.10.0.
