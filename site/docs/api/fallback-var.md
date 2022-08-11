---
title: fallbackVar
parent: api
---

# fallbackVar

Provides fallback values for variables that have been created using vanilla-extract APIs, e.g. `createVar`, `createTheme`, etc.

As these APIs produce variable references that contain the CSS var function, e.g. `var(--colorVar__qzfheg0)`, it is necessary to handle the wrapping function when providing a fallback.

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

## Multiple fallback values

The `fallbackVar` function handles falling back across multiple variables by providing multiple parameters.

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
