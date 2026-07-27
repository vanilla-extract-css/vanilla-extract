import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

const properties = defineProperties({
  properties: {
    padding: [0, 8, 16],
  },
});

export const sprinkles = createSprinkles(properties);
