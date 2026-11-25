---
'@vanilla-extract/webpack-plugin': patch
---

Make `webpack` an optional peer dependency

This fixes an unmet peer dependency warning when using `@vanilla-extract/next-plugin`, as Next.js bundles its own copy of webpack.
