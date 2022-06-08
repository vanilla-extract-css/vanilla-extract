---
title: keyframes
---

# keyframes

Creates a locally scoped set of keyframes.

```tsx
// styles.css.ts

import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const animated = style({
  animation: `3s infinite ${rotate}`
});
```
