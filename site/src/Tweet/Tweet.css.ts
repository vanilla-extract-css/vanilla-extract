import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';

export const tweetLink = style({
  ':hover': {
    textDecoration: 'none',
  },
  ':focus': {
    outline: 'none',
  },
});

export const tweet = style({
  width: 400,
  boxShadow: `0 0 30px -10px ${vars.palette.blue300}`,
  selectors: {
    [`${tweetLink}:focus &`]: {
      boxShadow: `0 0 30px -10px ${vars.palette.pink400}`,
    },
  },
});

export const avatar = style({
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  backgroundSize: 'cover',
  height: 60,
  width: 60,
  overflow: 'hidden',
});
