---
title: assignVars
parent: api
---

# assignVars

Allows you to populate the values of a theme contract and assign them to a style.

While similar to [createTheme](/documentation/api/create-theme), this API provides more fine-grained control of how you populate the variables.

For example, this is useful for creating responsive themes since it can be used within `@media` blocks:

```ts compiled
// theme.css.ts

import {
  createThemeContract,
  style,
  assignVars
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  space: {
    small: null,
    large: null
  }
});

export const responsiveTheme = style({
  vars: assignVars(vars, {
    space: {
      small: '4px',
      large: '16px'
    }
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars, {
        space: {
          small: '8px',
          large: '32px'
        }
      })
    }
  }
});
```

## Partial theme contracts

As a convenience, the `assignVars` function can also handle populating sections of the theme contract.

For example, if the theme contract above also included a colour palette, we could choose to only implement the space scale responsively:

```ts compiled
// styles.css.ts

import {
  createThemeContract,
  style,
  assignVars
} from '@vanilla-extract/css';

export const vars = createThemeContract({
  color: {
    brand: null,
    accent: null
  },
  space: {
    small: null,
    large: null
  }
});

export const responsiveTheme = style({
  vars: assignVars(vars, {
    color: {
      brand: 'pink',
      accent: 'aquamarine'
    },
    space: {
      small: '4px',
      large: '16px'
    }
  }),
  '@media': {
    'screen and (min-width: 1024px)': {
      vars: assignVars(vars.space, {
        small: '8px',
        large: '32px'
      })
    }
  }
});
```
