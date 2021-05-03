---
title: Dynamic API
---

# Dynamic API

We also provide a lightweight standalone package to support dynamic runtime theming.

```bash
$ npm install @vanilla-extract/dynamic
```

## createInlineTheme

Implements a theme contract at runtime as an inline style object.

```ts
import { createInlineTheme } from '@vanilla-extract/dynamic';
import { vars, exampleStyle } from './styles.css.ts';

const customTheme = createInlineTheme(vars, {
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

Implements a theme contract on an element.

```ts
import { setElementTheme } from '@vanilla-extract/dynamic';
import { vars } from './styles.css.ts';

const element = document.getElementById('myElement');
setElementTheme(element, vars, {
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
import { vars } from './styles.css.ts';

const element = document.getElementById('myElement');
setElementVar(element, vars.color.brand, 'darksalmon');
```
