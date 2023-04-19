import { style } from '@vanilla-extract/css';

export const legacyStyle = style({
  fontWeight: 'bold',
  ':after': {
    content: 'This is a legacy style',
  },
});
