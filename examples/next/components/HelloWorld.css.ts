import { style } from '@vanilla-extract/css';

export const root = style({
  background: 'pink',
  color: 'blue',
  padding: '16px',
  transition: 'opacity .1s ease', // Testing autoprefixer
  ':hover': {
    opacity: 0.8,
  },
});
