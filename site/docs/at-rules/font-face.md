---
title: fontFace
---

# fontFace

Creates a custom font attached to a locally scoped font name.

```tsx
// style.css.ts

import { fontFace, style } from '@vanilla-extract/css';

const myFont = fontFace({
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: myFont
});
```
