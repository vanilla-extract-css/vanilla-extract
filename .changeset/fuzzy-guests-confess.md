---
'@mattsjones/css-core': patch
'@mattsjones/css-webpack-plugin': patch
---

Wait for end of filescope to insert rules in the browser runtime. This should more accurately reflect statically extracted CSS as it allows for media query merging and other optimizations.
