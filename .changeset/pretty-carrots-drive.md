---
'@vanilla-extract/babel-plugin': patch
'@vanilla-extract/vite-plugin': patch
---

Handle vite 2.6.

As of vite 2.6 and greater, `?used` gets appended to css imports, which causes the file imports to be not what we expected.

This caused mismatching classnames in the vite plugin, and it caused the babel plugin to not add filescopes when it should have.
