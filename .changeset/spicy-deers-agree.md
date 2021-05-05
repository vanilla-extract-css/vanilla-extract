---
'@vanilla-extract/vite-plugin': patch
---

Change vite-plugin to be a named export

BREAKING CHANGE

```diff
-import vanillaExtractPlugin from '@vanilla-extract/vite-plugin';
+import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// vite.config.js
export default {
  plugins: [vanillaExtractPlugin()]
}
```
