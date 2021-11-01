import { createVar, style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

const toggleBrightness = createVar();
const toggleContent = createVar();

export const root = style({
  outline: 'none',
  fontSize: 24,
  ':focus-visible': {
    filter: `drop-shadow(2px 2px 1px ${vars.palette.pink500})`,
  },
  vars: {
    [toggleBrightness]: '0',
    [toggleContent]: '"☀️"',
  },
  '::before': {
    content: toggleContent,
    filter: `contrast(0) brightness(${toggleBrightness})`,
  },
  selectors: {
    [`.${darkMode} &`]: {
      vars: {
        [toggleBrightness]: '10',
        [toggleContent]: '"🌙"',
      },
    },
  },
});
