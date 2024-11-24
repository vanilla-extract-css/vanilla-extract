import { createVar, style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles';
import { vars } from '../themes.css';

export const tweetLink = style({
  ':hover': {
    textDecoration: 'none',
  },
  ':focus': {
    outline: 'none',
  },
});

export const shadowColorVar = createVar();

export const tweet = style({
  maxWidth: 440,
  boxShadow: `0 0 30px -10px ${shadowColorVar}`,
  vars: {
    [shadowColorVar]: vars.palette.blue300,
  },
  selectors: {
    [`.${darkMode} &`]: {
      vars: {
        [shadowColorVar]: vars.palette.gray900,
      },
    },
    [`${tweetLink}:focus &`]: {
      vars: {
        [shadowColorVar]: vars.palette.pink400,
      },
    },
    [`.${darkMode} ${tweetLink}:focus &`]: {
      vars: {
        [shadowColorVar]: vars.palette.pink400,
      },
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
  clipPath: 'polygon(3% 2%, 100% 0, 94% 94%, 0 100%)',
});
