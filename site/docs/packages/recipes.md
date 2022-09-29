---
title: Recipes
parent: packages
---

# Recipes

Create multi-variant styles with a type-safe runtime API, heavily inspired by [Stitches](https://stitches.dev).

As with the rest of vanilla-extract, all styles are generated at build time.

```bash
npm install @vanilla-extract/recipes
```

## recipe

Creates a multi-variant style function that can be used at runtime or statically in `.css.ts` files.

Accepts an optional set of `base` styles, `variants`, `compoundVariants` and `defaultVariants`.

```ts compiled
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: {
    borderRadius: 6
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
    },
    rounded: {
      true: { borderRadius: 999 }
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
  <button class="${button({
    color: 'accent',
    size: 'large',
    rounded: true
  })}">
    Hello world
  </button>
`);
```

Your recipe configuration can also make use of existing variables, classes and styles.

For example, you can pass in the result of your [`sprinkles`](/documentation/packages/sprinkles) function directly.

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { reset } from './reset.css.ts';
import { sprinkles } from './sprinkles.css.ts';

export const button = recipe({
  base: [reset, sprinkles({ borderRadius: 'round' })],

  variants: {
    color: {
      neutral: sprinkles({ background: 'neutral' }),
      brand: sprinkles({ background: 'brand' }),
      accent: sprinkles({ background: 'accent' })
    },
    size: {
      small: sprinkles({ padding: 'small' }),
      medium: sprinkles({ padding: 'medium' }),
      large: sprinkles({ padding: 'large' })
    }
  },

  defaultVariants: {
    color: 'accent',
    size: 'medium'
  }
});
```

## RecipeVariants

A utility to make use of the recipe’s type interface. This can be useful when typing functions or component props that need to accept recipe values as part of their interface.

```ts
// button.css.ts
import {
  recipe,
  RecipeVariants
} from '@vanilla-extract/recipes';

export const button = recipe({
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
  }
});

// Get the type
export type ButtonVariants = RecipeVariants<typeof button>;

// the above will result in a type equivalent to:
export type ButtonVariants = {
  color?: 'neutral' | 'brand' | 'accent';
  size?: 'small' | 'medium' | 'large';
};
```
