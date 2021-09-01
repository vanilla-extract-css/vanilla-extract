---
'@vanilla-extract/css': minor
---

Support passing arrays of styles to `style` and `styleVariants`

Multiple styles can now be composed into a single rule by providing an array of styles.

```ts
import { style } from '@vanilla-extract/css';

const base = style({ padding: 12 });

export const primary = style([
  base,
  { background: 'blue' }
]);

export const secondary = style([
  base,
  { background: 'aqua' }
]);
```

When composed styles are used in selectors, they are assigned an additional class if required so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

```ts
import {
  style,
  globalStyle,
} from '@vanilla-extract/css';

const background = style({ background: 'mintcream' });
const padding = style({ padding: 12 });

export const container = style([background, padding]);

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```

This feature is a replacement for the standalone `composeStyles` function which is now marked as deprecated. You can use `style` with an array as a drop-in replacement.

```diff
-export const container = composeStyles(background, padding);
+export const container = style([background, padding]);
```
