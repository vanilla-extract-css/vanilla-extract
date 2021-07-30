---
'@vanilla-extract/sprinkles': minor
---

Allow the result of calling `atoms` to be used in selectors

Sprinkles now uses vanilla-extract’s updated [`composeStyles`](https://github.com/seek-oss/vanilla-extract#composestyles) function internally, which means that atomic styles can be treated as if they were a single class within vanilla-extract selectors.

```ts
// styles.css.ts
import { globalStyle } from '@vanilla-extract/css';
import { atoms } from './sprinkles.css.ts';

export const container = atoms({
  padding: 'small',
});

globalStyle(`${container} *`, {
  boxSizing: 'border-box'
});
```
