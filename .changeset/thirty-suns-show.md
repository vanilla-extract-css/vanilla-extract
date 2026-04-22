---
'@vanilla-extract/css': minor
---

`style`: Add support for `@scope` rules

**EXAMPLE USAGE**:

```ts
import { style } from '@vanilla-extact/css';
export const styleWithScopeRule = style({
  '@scope': {
    '(body)': {
      ':after': { content: '"Scoped to body"' },
    },
  },
});
```

`globalStyle`: Add support for `@scope` rules

**EXAMPLE USAGE**:

```ts
import { globalStyle } from '@vanilla-extact/css';
globalStyle('div', {
  '@scope': {
    '(body)': {
      ':after': { content: '"Scoped to body"' },
    },
  },
});
```
