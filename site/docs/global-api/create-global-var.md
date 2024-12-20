---
title: createGlobalVar
parent: global-api
---

# createGlobalVar

Similar to [`createVar`], `createGlobalVar` creates a global CSS variable reference:

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

[@property] rules can also be created using `createGlobalVar`:

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

[`createVar`]: /documentation/api/create-var
[@property]: https://developer.mozilla.org/en-US/docs/Web/CSS/@property
