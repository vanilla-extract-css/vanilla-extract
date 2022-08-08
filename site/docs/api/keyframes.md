---
title: keyframes
---

# keyframes

Creates a locally scoped [animation name](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name) for the defined [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes).

```ts compiled
// animation.css.ts

import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const spin = style({
  animationName: rotate,
  animationDuration: '3s'
});

// or interpolate as a shorthand:
export const spinAgain = style({
  animation: `${rotate} 3s`
});
```
