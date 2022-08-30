---
'@vanilla-extract/integration': patch
---

Omit [`Symbol.toStringTag`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) when serializing module exports.

Vite/Rollup sets this property to 'Module' which confuses `_.isPlainObject`

- https://rollupjs.org/guide/en/#outputgeneratedcode (output.generatedCode.symbols)
- https://github.com/vitejs/vite/pull/5018
- https://github.com/vitejs/vite/blob/757a92f1c7c4fa961ed963edd245df77382dfde6/packages/vite/src/node/build.ts#L466-L469
