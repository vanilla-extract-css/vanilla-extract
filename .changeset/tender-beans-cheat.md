---
'@vanilla-extract/css': minor
---

`style`: Add support for `@starting-style` rules

**EXAMPLE USAGE**:

```ts
import { style } from '@vanilla-extact/css';
export const styleWithStartingStyle = style({
  backgroundColor: 'black',
  '@starting-style': {
    backgroundColor: 'white',
  },
});
``
