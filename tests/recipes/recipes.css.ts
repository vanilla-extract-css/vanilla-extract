import { recipe } from '@vanilla-extract/recipes';

export const basic = recipe({
  base: {},

  variants: {
    spaceWithDefault: {
      small: {},
      large: {},
    },
    spaceWithoutDefault: {
      small: {},
      large: {},
    },
    color: {
      red: {},
      blue: {},
    },
  },

  defaultVariants: {
    spaceWithDefault: 'small',
  },

  compoundVariants: [
    {
      variants: { color: 'red', spaceWithDefault: 'small' },
      style: {},
    },
  ],
});

export const requiredVariants = recipe({
  base: {},

  variants: {
    required_1: {
      a: {},
      b: {},
      c: {},
    },

    required_2: {
      a: {},
      b: {},
      c: {},
    },

    optional: {
      a: {},
      b: {},
      c: {},
    },
  },

  requiredVariants: ['required_1', 'required_2'],
});
