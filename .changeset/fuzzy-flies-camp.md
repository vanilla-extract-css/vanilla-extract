---
'@vanilla-extract/webpack-plugin': minor
---

No longer require Babel to be run on .css.ts files

Previously, the `@vanilla-extract/webpack-plugin` required the `@vanilla-extract/babel-plugin` to be run over .css.ts files. In order to bring webpack inline with the other integrations, the `@vanilla-extract/webpack-plugin` can now be used without Babel. 

Note: Automatic debug ids still require the `@vanilla-extract/babel-plugin`.