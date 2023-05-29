import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

const basic = recipe({
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
});

export const cssWithRecipe = style({
  color: 'red',
  selectors: {
    [`.${basic.base} &`]: {
      color: 'blue',
    },
    [`.${basic.spaceWithDefault.large} &`]: {
      color: 'yellow',
    },
    [`.${basic.spaceWithoutDefault.small} &`]: {
      color: 'green',
    },
    [`.${basic.color.red} &`]: {
      color: 'black',
    },
    [`.${basic.spaceWithDefault.large}.${basic.rounded.true} &`]: {
      color: 'white',
    },
  },
});
