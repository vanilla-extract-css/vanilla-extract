import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css.js';

export const btn = style({
  background: vars.color.background.brand,
  borderRadius: vars.size.radius[200],
  color: vars.color.text.brand,
  ...vars.typography.body.medium,
  paddingBlock: vars.size.space[200],
  paddingInline: vars.size.space[300],
});
