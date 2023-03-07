import { style } from '@vanilla-extract/css';

const shared = style({
  padding: '20px',
  background: 'peachpuff',
});

export const sharedComposition = style([shared]);
