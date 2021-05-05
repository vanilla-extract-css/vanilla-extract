---
title: Utility functions
---

# Utility functions

We also provide a standalone package of optional utility functions to make it easier to work with CSS in TypeScript.

> 💡 This package can be used with any CSS-in-JS library.

```bash
$ npm install @vanilla-extract/css-utils
```

## calc

Streamlines the creation of CSS calc expressions.

```tsx
import { calc } from '@vanilla-extract/css-utils';

const styles = {
  height: calc.multiply('var(--grid-unit)', 2)
};
```

The following functions are available.

- `calc.add`
- `calc.subtract`
- `calc.multiply`
- `calc.divide`
- `calc.negate`

The `calc` export is also a function, providing a chainable API for complex calc expressions.

```tsx
import { calc } from '@vanilla-extract/css-utils';

const styles = {
  marginTop: calc('var(--space-large)')
    .divide(2)
    .negate()
    .toString()
};
```
