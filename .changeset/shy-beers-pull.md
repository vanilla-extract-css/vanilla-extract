---
'@vanilla-extract/vite-plugin': minor
---

Add `emitCssInSsr` option

Provides the ability to opt in to emitting CSS during SSR.

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      emitCssInSsr: true
    })
  ]
};
```