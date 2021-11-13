---
'@vanilla-extract/recipes': minor
---

Add `requiredVariants` option

You can now specify that certain variants are required via the `requiredVariants` option which accepts an array of variant names.

**Example usage:**

```ts
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet' },
      accent: { background: 'slateblue' }
    },
  },

  requiredVariants: ['color'],
});
```