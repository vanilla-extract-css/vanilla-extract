---
'@vanilla-extract/babel-plugin': patch
'@vanilla-extract/integration': patch
---

Improve Windows support

Normalize all file paths to POSIX format. This fixes incorrect file paths on Windows and ensures consistent hashes across all operating systems.
