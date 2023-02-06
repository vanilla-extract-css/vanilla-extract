---
'@vanilla-extract/css': patch
---

fix(css): opti getDevPrefix by removing filePath regex
which was especially slow when used against filePath located somewhere in node_modules
