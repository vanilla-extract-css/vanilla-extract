---
title: keyframes
parent: api
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

## Animating variables

It is also possible to animate [typed CSS property](/documentation/api/create-var#css-property) using keyframes:

```ts compiled
const angle = createVar({
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg'
});

const angleKeyframes = keyframes({
  '0%': {
    vars: {
      [angle]: '0deg'
    }
  },
  '100%': {
    vars: {
      [angle]: '360deg'
    }
  }
});

export const root = style({
  backgroundImage: `linear-gradient(${angle}, rgba(153, 70, 198, 0.35) 0%, rgba(28, 56, 240, 0.46) 100%)`,
  animation: `${angleKeyframes} 7s infinite ease-in-out both`,

  vars: {
    // This will fallback to 180deg if the @property is not supported by the browser
    [angle]: fallbackVar(angle, '180deg')
  }
});
```
