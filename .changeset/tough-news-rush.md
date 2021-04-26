---
'@vanilla-extract/css': patch
---

Improve dev prefixes on generated class names

- Add file name to class names even if no debug id is present
- If file is the index file use directory name instead
