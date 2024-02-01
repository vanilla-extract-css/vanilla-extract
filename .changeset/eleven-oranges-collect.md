---
'@vanilla-extract/webpack-plugin': patch
---

Fixes a bug that was causing style compilation to fail on paths containing [webpack template strings] such as `[id]` or [Next.js dynamic routes] such as `[slug]`.

[webpack template strings]: https://webpack.js.org/configuration/output/#template-strings
[next.js dynamic routes]: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
