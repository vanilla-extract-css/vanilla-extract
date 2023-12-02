---
'@vanilla-extract/webpack-plugin': patch
---

Fixes a bug that was causing style compilation to fail on paths containing [webpack template strings] such as `[id]`.

[webpack template strings]: https://webpack.js.org/configuration/output/#template-strings
