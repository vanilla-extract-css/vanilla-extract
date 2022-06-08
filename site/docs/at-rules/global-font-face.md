---
title: globalFontFace
---

# globalFontFace

Creates a globally scoped custom font.

```tsx
// app.css.ts

import {
  globalFontFace,
  style
} from '@vanilla-extract/css';

globalFontFace('MyGlobalFont', {
  src: 'local("Comic Sans MS")'
});

export const text = style({
  fontFamily: 'MyGlobalFont'
});
```
