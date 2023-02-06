---
'@vanilla-extract/vite-plugin': minor
---

Add `forceEmitCss` option

Provides the ability to force the plugin to emit CSS for a particular build.

```js
// vite.config.js

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default {
  plugins: [
    vanillaExtractPlugin({
      forceEmitCss: true
    })
  ]
};
```