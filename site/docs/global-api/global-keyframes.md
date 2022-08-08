---
title: globalKeyframes
parent: global-api
---

# globalKeyframes

Creates a globally scoped set of keyframes.

```ts compiled
// animation.css.ts

import {
  globalKeyframes,
  style
} from '@vanilla-extract/css';

const rotate = 'globalRotate';

globalKeyframes(rotate, {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const spin = style({
  animation: `3s infinite ${rotate}`
});
```
