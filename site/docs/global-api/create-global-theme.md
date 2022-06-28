---
title: createGlobalTheme
---

# createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

**Ensure this function is called within a `.css.ts` context, otherwise variable names will be mismatched between files.**

```ts compiled
// theme.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

> 💡 All theme variants must provide a value for every variable or it’s a type error.

If you want to implement an existing theme contract, you can pass it as the second argument.

```ts compiled
// theme.css.ts
import {
  createThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null
  },
  font: {
    body: null
  }
});

createGlobalTheme(':root', vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```
