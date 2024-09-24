import { style } from '@vanilla-extract/css';

export const root = style({
  background: 'lightcyan',
  color: 'oklab(59.686% 0.1009 0.1192)', // Testing Lightning CSS
  padding: '16px',
  transition: 'opacity .1s ease',
  ':hover': {
    opacity: 0.8,
  },
});
