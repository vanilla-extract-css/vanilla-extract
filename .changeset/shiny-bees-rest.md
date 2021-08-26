---
'@vanilla-extract/css': minor
---

Add `createGlobalThemeContract` function

Creates a contract of globally scoped variable names for themes to implement.

> 💡 This is useful if you want to make your theme contract available to non-JavaScript environments.

```ts
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme
} from '@vanilla-extract/css';
export const vars = createGlobalThemeContract({
  color: {
    brand: 'ui-color-brand'
  },
  font: {
    body: 'ui-font-body'
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

You can also provide a map function as the second argument which has access to the value and the object path.

For example, you can automatically prefix all variable names.

```ts
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
  (value) => `ui-${value}`
);
```

You can also use the map function to automatically generate names from the object path, joining keys with a hyphen.

```ts
// themes.css.ts
import {
  createGlobalThemeContract,
  createGlobalTheme
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
  (_value, path) => path.join('-')
);
```