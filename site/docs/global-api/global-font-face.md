---
title: globalFontFace
---

# globalFontFace

Creates a globally scoped custom font.

```ts compiled
// text.css.ts

import {
  globalFontFace,
  style
} from '@vanilla-extract/css';

const comicSans = 'GlobalComicSans';

globalFontFace(comicSans, {
  src: 'local("Comic Sans MS")'
});

export const font = style({
  fontFamily: comicSans
});
```
