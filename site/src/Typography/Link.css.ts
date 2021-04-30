import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';

export const underlineOnHover = style({
  selectors: {
    ['&:not(:hover)']: {
      textDecoration: 'none',
    },
  },
});

export const highlightOnHover = style({
  ':hover': {
    color: vars.palette.pink500,
  },
  ':focus': {
    outline: 'none',
    color: vars.palette.pink500,
  },
});
