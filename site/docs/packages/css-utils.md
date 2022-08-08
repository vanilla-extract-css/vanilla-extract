---
title: CSS Utils
parent: packages
---

# CSS Utils

An optional package providing utility functions that make it easier to work with CSS in TypeScript.

```bash
$ npm install @vanilla-extract/css-utils
```

This package is not limited to vanilla-extract—it can be used with any CSS-in-JS library.

## calc

Streamlines the creation of CSS calc expressions.

### Simple expressions

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

### Chainable expressions

The `calc` export is also a function, providing a chainable API for complex calc expressions.

> When using expression chains it is necessary to call `toString()` to return the constructed expression as the final value.

```tsx
import { calc } from '@vanilla-extract/css-utils';

const styles = {
  marginTop: calc('var(--space-large)')
    .divide(2)
    .negate()
    .toString()
};
```
