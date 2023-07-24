import { recipe } from '@vanilla-extract/recipes';

const basic = recipe({
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
});

export const recipeWithReferences = recipe({
  base: {
    color: 'red',
    selectors: {
      [`.${basic.classNames.base} &`]: {
        color: 'blue',
      },
      [`.${basic.classNames.variants.spaceWithDefault.large} &`]: {
        color: 'yellow',
      },
      [`.${basic.classNames.variants.spaceWithoutDefault.small} &`]: {
        color: 'green',
      },
    },
  },
  variants: {
    first: {
      true: {
        selectors: {
          [`.${basic.classNames.variants.color.red} &`]: {
            color: 'black',
          },
          [`.${basic.classNames.variants.spaceWithDefault.large}.${basic.classNames.variants.rounded.true} &`]:
            {
              color: 'white',
            },
        },
      },
    },
  },
});
