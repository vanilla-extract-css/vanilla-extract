---
'@vanilla-extract/css': minor
---

`style, globalStyle`: Add support for `@scope` rules

**EXAMPLE USAGE**:

```ts
import { style, globalStyle } from '@vanilla-extact/css';

export const styleWithScopeRule = style({
  '@scope': {
    '(body)': {
      ':after': { content: '"Scoped to body"' },
    },
  },
});

globalStyle('div', {
  '@scope': {
    '(body)': {
      ':after': { content: '"Scoped to body"' },
    },
  },
});
```
