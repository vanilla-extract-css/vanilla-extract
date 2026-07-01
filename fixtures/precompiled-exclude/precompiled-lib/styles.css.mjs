// Simulated pre-compiled output from a library using vanilla-extract recipes.
// This file contains a recipe runtime function which is NOT serializable.
// When vanilla-extract vite-plugin tries to process this file, it will fail
// because recipe functions cannot be serialized to JSON.
//
// This simulates what happens when consuming a library like @my-design/system
// that publishes pre-compiled .css.js files with recipe exports.

import { createRuntimeFn } from '@vanilla-extract/recipes/createRuntimeFn';

// This is the pre-compiled output of a recipe - it's a function, not serializable data
export const buttonRecipe = createRuntimeFn({
  defaultClassName: 'button_precompiled_abc123',
  variantClassNames: {
    size: {
      small: 'button_size_small_def456',
      large: 'button_size_large_ghi789',
    },
  },
  defaultVariants: {
    size: 'small',
  },
  compoundVariants: [],
});
