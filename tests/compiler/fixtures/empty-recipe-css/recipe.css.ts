import { recipe } from '@vanilla-extract/recipes';

import { sprinkles } from './sprinkles.css';

// Only composes pre-existing sprinkles atomic classes and emits no CSS of its own.
export const root = recipe({
  variants: {
    padded: {
      true: sprinkles({ padding: 16 }),
    },
  },
});
