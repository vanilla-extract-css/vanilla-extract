---
title: globalKeyframes
---

# globalKeyframes

Creates a globally scoped set of keyframes.

```tsx
// app.css.ts

import {
  globalKeyframes,
  style
} from '@vanilla-extract/css';

globalKeyframes('rotate', {
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const animated = style({
  animation: `3s infinite rotate`
});
```
