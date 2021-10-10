---
'@vanilla-extract/vite-plugin': patch
---

Update the vanilla runtime integration.

When using the vanilla browser runtime in vite, it now operates on a new model where a .css.js file is generated, that uses @vanilla-extract/css/injectStyles to add the css to the browser.

This allows for hot reloading of styles, and makes styles a bit easier to debug at dev time (because they're actually visible).
