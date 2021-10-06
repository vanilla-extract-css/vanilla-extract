---
'@vanilla-extract/vite-plugin': patch
---

Fixes a bug with vite where "?used" is appended to the file path of css files.

This could cause different class name hashes to be generated between SSR and client builds.
This was introduced in vite 2.6.0.
