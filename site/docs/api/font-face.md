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

## Multiple Fonts with Single Family

The `fontFace` function allows you to pass an array of font-face rules that may contain different rules but treat them as if they are from one font family.

```ts compiled
// text.css.ts
import { fontFace, style } from '@vanilla-extract/css';

const gentium = fontFace([
  {
    src: 'local("Gentium")',
    fontWeight: 'normal',
  },
  {
    src: 'local("Gentium Bold")',
    fontWeight: 'bold',
  },
]);

export const font = style({
  fontFamily: gentium,
});
```