---
'@vanilla-extract/recipes': minor
---

Add `RecipeVariants` type to get variants from a recipe.

This type allows you to extract the variants from the recipe function. Useful for consuming variants from a componen.

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';

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
    },
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
