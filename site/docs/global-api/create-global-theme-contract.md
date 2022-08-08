---
title: createGlobalThemeContract
parent: global-api
---

# createGlobalThemeContract

Creates a contract of globally scoped variable names for themes to implement.

This is useful if you want to make your theme contract available to non-JavaScript environments.

> 🎨&nbsp;&nbsp;New to theming in vanilla-extract? Make sure you’ve read the [theming overview](/documentation/theming) first.

```ts compiled
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme,
  style
} from '@vanilla-extract/css';

export const vars = createGlobalThemeContract({
  color: {
    brand: 'color-brand'
  },
  font: {
    body: 'font-body'
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

export const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body
});
```

## Formatting the variable names

A map function can be provided as the second argument which has access to the value and the object path.

For example, you can automatically prefix all variable names:

```ts compiled
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: 'color-brand'
    },
    font: {
      body: 'font-body'
    }
  },
  (value) => `prefix-${value}`
);

createGlobalTheme(':root', vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

Or, automatically generate names from the object path.

For example, converting to title case:

```ts compiled
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';

const toTitleCase = (s) =>
  `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: null
    },
    font: {
      body: null
    }
  },
  (_value, path) => `${path.map(toTitleCase).join('')}`
);

createGlobalTheme(':root', vars, {
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```
