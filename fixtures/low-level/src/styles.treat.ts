import { style, createVar } from '@mattsjones/css-core';

const color = createVar();

export const block = style({
  vars: {
    [color]: 'blue',
  },
  backgroundColor: color,
  color: 'white',
  padding: 20,
});
