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
});

export const nestedSelectors = recipe({
  base: {
    selectors: {
      [`${basic.classNames.base} &`]: {},
    },
  },
  variants: {
    first: {
      true: {
        selectors: {
          [`${basic.classNames.variants.spaceWithDefault.large} &`]: {},
        },
      },
    },
  },
});
