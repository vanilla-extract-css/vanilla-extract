---
title: createGlobalTheme
---

# createGlobalTheme

Creates a theme attached to a global selector, but with locally scoped variable names.

> 🎨&nbsp;&nbsp;New to theming in vanilla-extract? Make sure you’ve read the [theming overview](/documentation/theming) first.

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

All theme values must be provided or it’s a type error.

Importing this stylesheet as a side affect to include the styles in your CSS bundle.

```ts
// app.ts
import './theme.css.ts';
```

## Implementing a Theme Contract

An existing theme contract can be implemented by passing it as the second argument.

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
