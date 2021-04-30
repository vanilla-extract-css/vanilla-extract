---
title: Dynamic API
---

# Dynamic API

We also provide a lightweight standalone package to support dynamic runtime theming.

```bash
$ yarn add --dev @vanilla-extract/dynamic
```

## createInlineTheme

Generates a custom theme at runtime as an inline style object.

```ts
import { createInlineTheme } from '@vanilla-extract/dynamic';
import { themeVars, exampleStyle } from './styles.css.ts';

const customTheme = createInlineTheme(themeVars, {
  small: '4px',
  medium: '8px',
  large: '16px'
});

document.write(`
  <section style="${customTheme}">
    <h1 class="${exampleStyle}">Hello world!</h1>
  </section>
`);
```

## setElementTheme

Sets a collection of CSS Variables on an element.

```ts
import { setElementTheme } from '@vanilla-extract/dynamic';
import { themeVars } from './styles.css.ts';
const element = document.getElementById('myElement');
setElementTheme(element, themeVars, {
  small: '4px',
  medium: '8px',
  large: '16px'
});
```

> 💡 All variables passed into this function must be assigned or it’s a type error.

## setElementVar

Sets a single var on an element.

```ts
import { setElementVar } from '@vanilla-extract/dynamic';
import { themeVars } from './styles.css.ts';
const element = document.getElementById('myElement');
setElementVar(element, themeVars.color.brand, 'darksalmon');
```