---
'@vanilla-extract/css': patch
---

Shorten identifiers by removing leading underscores

The logic for generating identifiers has been changed so that an alpha character is guaranteed to be at the start, eliminating the need to prefix with an underscore when a number is the first character.
