import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';

export const code = style({
  fontFamily: vars.fonts.code,
  padding: '8px',
  margin: '-8px 4px',
  borderRadius: vars.border.radius.small,
});
