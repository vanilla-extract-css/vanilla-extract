---
'@vanilla-extract/css': minor
---

Add support for container queries via the new `@container` key.

```ts
import { style } from '@vanilla-extract/css';

export const myStyle = style({
  '@container': {
    '(min-width: 400px)': {
      display: 'flex'
    }
  }
});
```
