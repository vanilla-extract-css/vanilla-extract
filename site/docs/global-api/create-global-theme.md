---
title: createGlobalTheme
parent: global-api
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

Importing this stylesheet as a side effect to include the styles in your CSS bundle.

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

## @layer

Global themes can be assigned to a layer by name using the `@layer` key at the top-level of the theme definition.

> 🚧&nbsp;&nbsp;Ensure your target browsers [support layers].
> Vanilla Extract supports the [layers syntax][layer] but does not polyfill the feature in unsupported browsers.

```ts compiled
// theme.css.ts
import {
  createGlobalTheme,
  layer
} from '@vanilla-extract/css';

export const themeLayer = layer();

export const vars = createGlobalTheme(':root', {
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
