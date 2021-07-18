import { createVar, style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';

const toggleBrightness = createVar();
const toggleContent = createVar();

export const root = style({
  outline: 'none',
  fontSize: 24,
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
