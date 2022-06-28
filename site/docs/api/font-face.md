---
title: fontFace
---

# fontFace

Creates a custom font attached to a locally scoped font name.

```ts compiled
// text.css.ts

import { fontFace, style } from '@vanilla-extract/css';

const comicSans = fontFace({
  src: 'local("Comic Sans MS")'
});

export const font = style({
  fontFamily: comicSans
});
```
