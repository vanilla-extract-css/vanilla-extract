import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';

export const errorUnderline = style({
  textDecoration: 'dashed',
  textDecorationColor: vars.palette.red,
  textDecorationThickness: '3px',
  textDecorationLine: 'underline',
  textUnderlineOffset: '2px',
});
