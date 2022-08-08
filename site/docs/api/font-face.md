---
title: fontFace
parent: api
---

# fontFace

Creates a locally scoped [font-family](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-family) for the defined [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

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
