---
'@vanilla-extract/webpack-plugin': patch
'@vanilla-extract/next-plugin': patch
---

Use a more accurate regex for detecting [webpack template strings] in paths

We now use a modified version of the regex from the webpack source code to detect template strings in paths.
As long as the path isn't already escaped, we should detect it.

[webpack template strings]: https://webpack.js.org/configuration/output/#template-strings
