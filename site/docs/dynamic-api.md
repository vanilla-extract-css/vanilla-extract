---
title: Dynamic API
---

# Dynamic API

We also provide a lightweight standalone package to support dynamic runtime theming.

```bash
$ npm install @vanilla-extract/dynamic
```

## assignInlineVars

Assigns CSS Variables as inline styles. This function returns an object of inline styles, but its `toString` method also returns a valid `style` attribute value so that it can be used directly in string templates.

```tsx
// app.ts

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars, exampleStyle } from './styles.css.ts';

document.write(`
  <section style="${assignInlineVars({
    [vars.colors.brand]: 'pink',
    [vars.colors.accent]: 'green'
  })}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

You can also assign collections of variables by passing a theme contract as the first argument. All variables must be assigned or it’s a type error.

```tsx
// app.ts

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars, exampleStyle } from './styles.css.ts';

document.write(`
  <section style="${assignInlineVars(vars.colors, {
    brand: 'pink',
    accent: 'green'
  })}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

## setElementVars

Sets CSS Variables on an element.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const element = document.getElementById('myElement');
setElementVars(element, {
  [vars.colors.brand]: 'pink',
  [vars.colors.accent]: 'green'
});
```

You can also set collections of variables by passing a theme contract as the second argument. All variables must be assigned or it’s a type error.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const element = document.getElementById('myElement');
setElementVars(element, vars.colors, {
  brand: 'pink',
  accent: 'green'
});
```
