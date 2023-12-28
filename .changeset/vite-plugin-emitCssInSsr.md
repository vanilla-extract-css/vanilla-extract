---
'@vanilla-extract/vite-plugin': minor
---

`emitCssInSsr` is now on by default.

This means that the CSS emitted by the plugin is now processed by Vite, so we no longer need to resolve PostCSS plugins and process it ourselves.

**Example usage**

```ts
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin()]
});
```

Users can opt into the old/current behaviour by explicitly setting `emitCssInSsr` to `false`. This is very useful for design systems (e.g. [Braid](https://github.com/seek-oss/braid-design-system)), where you want to distribute your Vanilla Extract files as JavaScript modules, but you want to extract the CSS later i.e. when the app is built.

**Example usage**

```ts
// vite.config.js
import { defineConfig } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [vanillaExtractPlugin({ emitCssInSsr: false })]
});
```

```js
// input: /my-package/app/app.css.ts
import { style } from '@vanilla-extract/css';

export const myStyle = style({});
```

```js
// output: /my-package/dist/app.css.mjs
import { setFileScope, endFileScope } from '@vanilla-extract/css/fileScope';
setFileScope('app/app.css.ts', 'my-package');
import { style } from '@vanilla-extract/css';

export const myStyle = style({}, 'myStyle');
endFileScope();
```
