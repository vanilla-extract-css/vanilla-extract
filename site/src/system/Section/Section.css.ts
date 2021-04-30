import { style } from '@vanilla-extract/css';
import { vars } from '../../themes.css';

export const root = style({
  margin: '0 auto',
  '@media': {
    'screen and (min-width: 1024px)': {
      maxWidth: vars.contentWidth,
    },
  },
});
