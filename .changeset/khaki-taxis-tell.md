---
'@vanilla-extract/css': patch
---

Change the way vanilla runtime works.

The vanilla browser runtime now operates on a new model where a .css.js file is generated, that uses @vanilla-extract/css/injectStyles to add the css to the browser.

This allows for hot reloading of styles, and makes styles a bit easier to debug at dev time (because they're actually visible).
