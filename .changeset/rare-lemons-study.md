---
'@vanilla-extract/recipes': minor
---

Add `RecipeVariants` type to get variants from a recipe.

This type would help consumers easily get the variants type. Useful for typing their components:

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';
import { reset } from './reset.css.ts';
import { sprinkles } from './sprinkles.css.ts';

export const button = recipe({
  variants: {
    color: {
      neutral: {
        background: 'neutral'
      },
      brand: {
        background: 'brand'
      },
      accend: {
        background: 'accent'
      }
    },
    size: {
      small: {
        padding: 'small'
      },
      medium: {
        padding: 'medium'
      },
      large: {
        padding: 'large'
      }
    }
  }
});

// Get the type 
export type ButtonVariants = RecipeVariants<typeof button>;

// the above will result in a type equivalent to:
export type ButtonVariants = {
  color?: 'neutral' | 'brand' | 'size';
  size?: 'small' | 'medium' | 'large';
};
```
