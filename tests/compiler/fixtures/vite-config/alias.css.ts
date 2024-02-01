import { style } from '@vanilla-extract/css';
// @ts-expect-error aliased path
import { styleSquare } from '@util/style.css';

export const styleBase = style([
  styleSquare,
  {
    color: 'red',
  },
]);
