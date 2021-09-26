---
'@vanilla-extract/recipes': minor
---

Add `RecipeVariants` type

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
