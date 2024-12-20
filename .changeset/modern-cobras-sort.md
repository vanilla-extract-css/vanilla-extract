---
"@vanilla-extract/css": minor
---

`keyframes`: Add support for a `vars` property to steps within `keyframes` declarations

Example usage:

```ts
import { createVar, keyframes } from '@vanilla-extract/css';

const angle = createVar({
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg'
});

export const angleKeyframes = keyframes({
  '0%': {
    vars: {
      [angle]: '0deg'
    }
  },
  '100%': {
    vars: {
      [angle]: '360deg'
    }
  }
});
```
