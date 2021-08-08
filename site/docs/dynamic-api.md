---
title: Dynamic API
---

# Dynamic API

We also provide a lightweight standalone package to support dynamic runtime theming.

```bash
$ npm install @vanilla-extract/dynamic
```

## assignInlineVars

Assigns CSS Variables as inline styles.

```tsx
// app.tsx

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

const MyComponent = () => (
  <section
    style={assignInlineVars({
      [vars.colors.brand]: 'pink',
      [vars.colors.accent]: 'green'
    })}
  >
    ...
  </section>
);
```

You can also assign collections of variables by passing a theme contract as the first argument. All variables must be assigned or it’s a type error.

```tsx
// app.tsx

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

const MyComponent = () => (
  <section
    style={assignInlineVars(vars.colors, {
      brand: 'pink',
      accent: 'green'
    })}
  >
    ...
  </section>
);
```

Even though this function returns an object of inline styles, its `toString` method returns a valid `style` attribute value so that it can be used in string templates.

```tsx
// app.ts

import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './vars.css.ts';

document.write(`
  <section style="${assignInlineVars({
    [vars.colors.brand]: 'pink',
    [vars.colors.accent]: 'green'
  })}">
    ...
  </section>
`);
```

## setElementVars

Sets CSS Variables on a DOM element.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const el = document.getElementById('myElement');

setElementVars(el, {
  [vars.colors.brand]: 'pink',
  [vars.colors.accent]: 'green'
});
```

You can also set collections of variables by passing a theme contract as the second argument. All variables must be set or it’s a type error.

```tsx
// app.ts

import { setElementVars } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const el = document.getElementById('myElement');

setElementVars(el, vars.colors, {
  brand: 'pink',
  accent: 'green'
});
```
