---
'@vanilla-extract/vite-plugin': minor
---

Add a new `mode: "transform"` option (the default is `mode: "emitCss"`).

This is very useful for design systems (e.g. [Braid](https://github.com/seek-oss/braid-design-system)), where you want to distribute your Vanilla Extract files as JavaScript modules, but you want to extract the CSS later i.e. when the app is built.

**Example usage**

```ts
// vite.config.js

import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({
      mode: 'transform',
    }),
  ],
});
```

Input:

```ts
// ~/my-design-system/src/style.css.ts

import { style } from '@vanilla-extract/css';

export const box = style({});
```

Output:

```js
// ~/my-design-system/dist/style.css.mjs

import { setFileScope, endFileScope } from '@vanilla-extract/css/fileScope';
setFileScope('src/style.css.ts', 'my-design-system');
import { style } from '@vanilla-extract/css';

export const box = style({}, 'box');
endFileScope();
```
