---
title: fallbackVar
---

# fallbackVar

Provides fallback values when consuming variables.

```ts compiled
// style.css.ts

import {
  createVar,
  fallbackVar,
  style
} from '@vanilla-extract/css';

export const colorVar = createVar();

export const color = style({
  color: fallbackVar(colorVar, 'blue')
});
```

Multiple fallbacks are also supported.

```ts compiled
// style.css.ts

import {
  createVar,
  fallbackVar,
  style
} from '@vanilla-extract/css';

export const primaryVar = createVar();
export const secondaryVar = createVar();

export const color = style({
  color: fallbackVar(primaryVar, secondaryVar, 'blue')
});
```
