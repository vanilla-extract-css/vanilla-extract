---
'@vanilla-extract/css': patch
---

`style`: Fixed a bug where nested arrays of classnames could cause missing or malformed CSS during [style composition](https://vanilla-extract.style/documentation/style-composition/) in certain situations.

For example, the following style composition would not generate CSS for the `backgroundColor: 'orange'` style, and would also generate malformed CSS:

```ts
const styleWithNestedComposition = style([
  [style1, style2],
  { backgroundColor: 'orange' },
  [style3],
]);
```
