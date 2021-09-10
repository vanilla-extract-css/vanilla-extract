---
title: Recipes API
---

# Recipes API

Create multi-variant style collections, heavily inspired by [Stitches.](https://stitches.dev)

```bash
$ npm install @vanilla-extract/recipes
```

## recipe

Creates a recipe function. Accepts an optional set of `base` styles, `variants`, `compoundVariants` and `defaultVariants`.

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: {
    borderRadius: 999
  },

  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' }
    },
    size: {
      small: { padding: 12 },
      medium: { padding: 16 },
      large: { padding: 24 }
    }
  },

  // Applied when multiple variants are set at once
  compoundVariants: [
    {
      variants: {
        color: 'neutral',
        size: 'large'
      },
      style: {
        background: 'ghostwhite'
      }
    }
  ],

  defaultVariants: {
    color: 'accent',
    size: 'medium'
  }
});
```

With this recipe configured, you can now use it in your templates.

```ts
// app.ts
import { button } from './button.css.ts';

document.write(`
  <button class={${button({
    color: 'accent',
    size: 'large'
  })}}>
    Hello world
  </button>
`);
```

Your recipe configuration can also make use of existing variables, classes and styles.

For example, you can use your `atoms` function from [Sprinkles.](https://github.com/seek-oss/vanilla-extract/tree/master/packages/sprinkles)

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { reset } from './reset.css.ts';
import { atoms } from './sprinkles.css.ts';

export const button = recipe({
  base: [
    reset,
    { borderRadius: atoms({ borderRadius: 'round' }) }
  ],

  variants: {
    color: {
      neutral: atoms({ background: 'neutral' }),
      brand: atoms({ background: 'brand' }),
      accent: atoms({ background: 'accent' })
    },
    size: {
      small: atoms({ padding: 'small' }),
      medium: atoms({ padding: 'medium' }),
      large: atoms({ padding: 'large' })
    }
  },

  defaultVariants: {
    color: 'accent',
    size: 'medium'
  }
});
```
