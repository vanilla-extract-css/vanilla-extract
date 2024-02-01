import { style } from '@vanilla-extract/css';
// @ts-expect-error aliased path
import { border } from '@util/vars.css';

export const root = style({
  vars: {
    [border]: '1px solid black',
  },
  border,
});
