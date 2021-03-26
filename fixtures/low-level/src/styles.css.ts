import { style, createVar } from '@vanilla-extract/css';

const color = createVar();

export const block = style({
  vars: {
    [color]: 'blue',
  },
  backgroundColor: color,
  color: 'white',
  padding: 20,
});
