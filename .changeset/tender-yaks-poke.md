---
'@vanilla-extract/babel-plugin': major
---

Remove filescope appending

Previously, this plugin appended vanilla-extract filescopes to `.css.ts` files, as well as adding debug IDs to style calls. Filescopes are essential to make vanilla-extract work. Filescope appending has been moved exclusively to the `@vanilla-extract/integration` package.

Migration Guide

In most cases, you should remove this plugin entirely from your setup and everything will continue working as expected. 

If you were using this plugin to make vanilla-extract work in [Jest](https://jestjs.io/) then you should migrate to [`@vanilla-extract/jest`](https://vanilla-extract.style/documentation/test-environments/).