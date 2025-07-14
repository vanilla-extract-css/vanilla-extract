---
'@vanilla-extract/rollup-plugin': minor
---

Add "extract" option which bundles CSS into one bundle. Removes .css imports.

**EXAMPLE USAGE**:
```ts
vanillaExtractPlugin({
  extract: {
    name: 'bundle.css',
    sourcemap: false
  }
});
