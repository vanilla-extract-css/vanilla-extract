---
title: globalStyle
parent: global-api
---

# globalStyle

Creates styles attached to a global selector.

```ts compiled
// app.css.ts

import { globalStyle } from '@vanilla-extract/css';

globalStyle('html, body', {
  margin: 0
});
```

Global selectors can also contain references to other scoped class names.

```ts compiled
// app.css.ts

import { style, globalStyle } from '@vanilla-extract/css';

export const parentClass = style({});

globalStyle(`${parentClass} > a`, {
  color: 'pink'
});
```
