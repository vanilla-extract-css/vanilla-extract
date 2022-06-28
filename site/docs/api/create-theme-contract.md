---
title: createThemeContract
---

# createThemeContract

Creates a contract of locally scoped variable names for themes to implement.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

> 💡 This is useful if you want to split your themes into different bundles. In this case, your themes would be defined in separate files, but we'll keep this example simple.

```ts compiled
// themes.css.ts
import {
  createThemeContract,
  createTheme,
  style
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

export const themeA = createTheme(vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const themeB = createTheme(vars, {
  color: {
    brand: 'pink'
  },
  font: {
    body: 'comic sans ms'
  }
});

export const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body
});
```
