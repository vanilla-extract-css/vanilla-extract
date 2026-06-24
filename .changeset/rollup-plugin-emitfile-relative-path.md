---
'@vanilla-extract/rollup-plugin': patch
---

Fixed an issue where builds using rolldown could fail when a `.css.ts` file imports across packages

`renderChunk` passed `moduleInfo.id` directly as the `name` for `emitFile`, which can be a relative path (e.g. `../styles/foo.css.ts.vanilla.css`) for cross-package imports. Recent rolldown versions reject relative or absolute paths in the `name` field, throwing `The "fileName" or "name" properties of emitted chunks and assets must be strings that are neither absolute nor relative paths`. The `name` is now stripped to its basename, which rolldown accepts and which still produces the same final asset filename via `assetFileNames`.
