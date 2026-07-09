---
'@vanilla-extract/rollup-plugin': patch
---

Fixed an issue where rolldown builds could fail when emitted CSS asset names include relative paths, such as when processing dependency or nested `.css.ts` files.

This may change filepaths in build output (directory prefixes from input paths are no longer included in emitted CSS filenames), but asset contents and import paths in JS output remain correct.
