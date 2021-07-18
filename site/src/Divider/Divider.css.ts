import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';

export const root = style({
  height: `${calc(vars.grid).multiply(2)}`,
  width: 120,
});
