import { createFillings } from '@vanilla-extract/fillings';

export const basic = createFillings({
  properties: ['margin', 'padding'],
});

export const defaultCondition = 'base';

export const conditional = createFillings({
  properties: ['margin', 'padding'],
  defaultCondition,
  conditions: {
    base: {
      '@media': '',
    },
    lg: {
      '@media': 'screen and (min-width: 1000px)',
    },
  },
});
