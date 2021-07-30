---
'@vanilla-extract/css': minor
'@vanilla-extract/esbuild-plugin': minor
'@vanilla-extract/integration': minor
'@vanilla-extract/snowpack-plugin': minor
'@vanilla-extract/vite-plugin': minor
'@vanilla-extract/webpack-plugin': minor
---

Allow the result of `composeStyles` to be used in selectors

When style compositions are used in selectors, they are now assigned an additional class so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

```ts
import {
  style,
  globalStyle,
  composeStyles
} from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

export const container = composeStyles(background, padding);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```