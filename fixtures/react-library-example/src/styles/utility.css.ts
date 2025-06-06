import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.js';

// Note: these aren’t meant to be intended as best practice over Sprinkles,
// these are only testing style() declarations loaded differently

export const mt100 = style({ marginTop: vars.size.space[100] });
export const mt200 = style({ marginTop: vars.size.space[200] });
export const mt300 = style({ marginTop: vars.size.space[300] });
export const mt400 = style({ marginTop: vars.size.space[400] });
