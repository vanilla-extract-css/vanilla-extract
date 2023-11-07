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
    rounded: {
      true: { borderRadius: 999 },
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

export const empty = recipe({});

export const definedStringBase = recipe({
  base: 'definedStringBase',
  variants: {
    variant: {
      simple: 'simple-one',
    },
  },
});

export const definedStringBaseArray = recipe({
  base: ['definedStringBaseInArray_1', 'definedStringBaseInArray_2'],
  variants: {
    variant: {
      simple: ['simple-one', 'simple-two'],
    },
  },
});
