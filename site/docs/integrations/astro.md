---
title: Astro
parent: integrations
---

# Astro

Integrating Vanilla Extract with [Astro](https://astro.build) is done with the help of the [Vite plugin][vite integration].

## Installation

```bash
npm install @vanilla-extract/css
npm install @vanilla-extract/vite-plugin --save-dev
```

## Setup

Add Vanilla Extract Vite plugin to the Astro configuration:

```js
import { defineConfig } from 'astro/config';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [vanillaExtractPlugin()]
  }
});
```

You'll then be able to use `style` and other APIs in `.css.ts` files.

```ts
// button.css.ts

import { style } from '@vanilla-extract/css';

export const button = style({
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '0.25rem',
  color: 'white',
  background: '#333'
});
```

And now you can reference styles in your Astro component:

```tsx
//  Button.astro

---
import { button } from './button.css'
---

<button class={button}>Click Me!</button>
```

## Configuration

See the [Vite integration page][vite integration] for documentation on the Vite plugin.

[vite integration]: /documentation/integrations/vite
