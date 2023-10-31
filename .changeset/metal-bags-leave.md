---
'@vanilla-extract/dynamic': minor
---

`setElementVars` now accepts `null` and `undefined` values

Variables with a value of `null` or `undefined` will not be assigned a value.

**NOTE:** This only applies to the case where a theme contract is not provided.

```ts
import { setElementVars } from '@vanilla-extract/dynamic';
import { brandColor, textColor } from './styles.css.ts';

const el = document.getElementById('myElement');

setElementVars(el, {
  [brandColor]: 'pink',
  [textColor]: null
});
```
