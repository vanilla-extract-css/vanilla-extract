import { style, createVar } from '@vanilla-extract/css';

export const depdepColor = createVar();

export const depdepBlock = style({
  vars: {
    [depdepColor]: 'blue',
  },
  backgroundColor: depdepColor,
});
