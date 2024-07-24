import { style } from '@vanilla-extract/css';
import { base } from './base.css';

export const button = style([
  base,
  {
    color: 'red',
  },
]);
