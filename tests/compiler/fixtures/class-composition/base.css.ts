import { style } from '@vanilla-extract/css';

export const fontFamilyBase = style({
  fontFamily: 'Arial, sans-serif',
});

export const base = style([fontFamilyBase, { background: 'blue' }]);
