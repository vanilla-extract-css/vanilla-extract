import { style, createVar } from '@vanilla-extract/css';

export const depColor = createVar();

export const depBlock = style({
  vars: {
    [depColor]: 'green',
  },
  backgroundColor: depColor,
});
