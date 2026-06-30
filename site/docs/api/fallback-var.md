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

## Empty string fallback

An empty string is a valid fallback value.
It produces the CSS empty-fallback form, e.g. `var(--insetVar__qzfheg0, )`, which allows the variable to resolve to nothing when it has not been set.

```ts compiled
// style.css.ts

import {
  createVar,
  fallbackVar,
  style
} from '@vanilla-extract/css';

export const insetVar = createVar();

export const shadow = style({
  boxShadow: `${fallbackVar(insetVar, '')} 0 0 0 3px red`
});
```
