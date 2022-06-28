---
title: createGlobalThemeContract
---

# createGlobalThemeContract

Creates a contract of globally scoped variable names for themes to implement.

> 💡 This is useful if you want to make your theme contract available to non-JavaScript environments.

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

You can also provide a map function as the second argument which has access to the value and the object path.

For example, you can automatically prefix all variable names.

```ts compiled
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme,
  style
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

export const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body
});
```

You can also use the map function to automatically generate names from the object path, joining keys with a hyphen.

```ts compiled
// themes.css.ts
import {
  createGlobalThemeContract,
  style
} from '@vanilla-extract/css';

export const vars = createGlobalThemeContract(
  {
    color: {
      brand: null
    },
    font: {
      body: null
    }
  },
  (_value, path) =>
    `prefix${path
      .map(
        // convert theme contract path to camel case
        (p) => `${p.charAt(0).toUpperCase()}${p.slice(1)}`
      )
      .join('')}`
);

export const brandText = style({
  color: vars.color.brand,
  fontFamily: vars.font.body
});
```
