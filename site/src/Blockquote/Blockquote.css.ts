import { globalStyle, style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

export const root = style({});

globalStyle(`${root} code`, {
  background: vars.palette.blue200,
  color: 'inherit',
});

globalStyle(`.${darkMode} ${root} code`, {
  background: vars.palette.blueGray800,
  color: 'inherit',
});
