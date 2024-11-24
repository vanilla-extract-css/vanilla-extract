---
title: createGlobalVar
parent: global-api
---

# createGlobalVar

Similar to `createVar`, `createGlobalVar` creates a single global CSS Variable reference.

```ts compiled
// vars.css.ts

import {
  createGlobalVar,
  style
} from '@vanilla-extract/css';

const opacityVar = createGlobalVar('opacity');

export const content = style({
  opacity: opacityVar
});
```

It's also possible to define typed CSS properties via `createGlobalVar`:

```ts compiled
// vars.css.ts

import {
  createGlobalVar,
  style
} from '@vanilla-extract/css';

const opacityVar = createGlobalVar('opacity', {
  syntax: '<number>',
  inherits: false,
  initialValue: '0.5'
});

export const content = style({
  opacity: opacityVar
});
```
