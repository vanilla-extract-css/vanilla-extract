---
'@vanilla-extract/sprinkles': patch
---

Allow `undefined` property values at the type level.
This change better compatibility with projects that set the [`exactOptionalPropertyTypes`][exactOptionalPropertyTypes] flag to `true`.

[exactOptionalPropertyTypes]: https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes
