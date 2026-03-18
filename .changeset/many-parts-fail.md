---
'@vanilla-extract/rollup-plugin': patch
---

Fixed a bug where side-effect `require`s would not be stripped when bundling CSS with the `extract` option 
