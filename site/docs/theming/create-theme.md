---
title: createTheme
---

# createTheme

Creates a locally scoped theme class and a theme contract which can be consumed within your styles.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

```ts compiled
// theme.css.ts

import { createTheme, style } from '@vanilla-extract/css';

export const [themeClass, vars] = createTheme({
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});

export const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body
});
```

You can create theme variants by passing a theme contract as the first argument to `createTheme`.

```ts compiled
// themes.css.ts
import { createTheme, style } from '@vanilla-extract/css';

export const [themeA, vars] = createTheme({
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

> 💡 All theme variants must provide a value for every variable or it’s a type error.
