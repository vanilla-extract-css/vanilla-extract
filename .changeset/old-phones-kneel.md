---
'@vanilla-extract/css': patch
'@vanilla-extract/dynamic': patch
'@vanilla-extract/private': patch
'@vanilla-extract/recipes': patch
'@vanilla-extract/sprinkles': patch
'@vanilla-extract/css-utils': patch
---

Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.
