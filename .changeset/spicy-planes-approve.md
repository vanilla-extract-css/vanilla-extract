---
'@vanilla-extract/next-plugin': patch
---

Fix `Cannot find module *.css.ts.vanilla.css` issue

Previously, CSS was being output on both the client and server builds. This fix ensure CSS is only output on the client build.