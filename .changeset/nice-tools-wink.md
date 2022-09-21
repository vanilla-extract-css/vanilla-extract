---
'@vanilla-extract/webpack-plugin': minor
'@vanilla-extract/next-plugin': minor
---

Remove requirement for `@vanilla-extract/babel-plugin`

Previously, to get automatic debug IDs you needed to use Babel with the `@vanilla-extract/babel-plugin` in your config. As this is no longer the case, the `@vanilla-extract/babel-plugin` should be removed completely from your project.