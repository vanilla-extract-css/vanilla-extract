---
title: createTheme
parent: api
---

# createTheme

Creates a locally scoped theme class and a theme contract which can be consumed within your styles.

> 🎨&nbsp;&nbsp;New to theming in vanilla-extract? Make sure you’ve read the [theming overview](/documentation/theming) first.

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

## Creating theme variants

Theme variants can be created by passing a theme contract as the first argument to `createTheme`.

All theme values must be provided or it’s a type error.

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

## @layer

Themes can be assigned to a layer by name using the `@layer` key at the top-level of the theme definition.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

```ts compiled
// themes.css.ts
import { createTheme, layer } from '@vanilla-extract/css';

export const themeLayer = layer();

export const [themeA, vars] = createTheme({
  '@layer': themeLayer,
  color: {
    brand: 'blue'
  },
  font: {
    body: 'arial'
  }
});
```

[support layers]: https://caniuse.com/css-cascade-layers
[layer]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
