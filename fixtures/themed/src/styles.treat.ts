import { style } from '@mattsjones/css-core';
import { shadow } from './shared.treat';
import { tokens } from './themes.treat';

export const button = [
  style({
    backgroundColor: tokens.colors.background,
    color: tokens.colors.text,
    '@media': {
      'only screen and (min-width: 500px)': {
        borderRadius: '9999px',
      },
    },
  }),
  shadow,
];

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.space[2],
  padding: tokens.space[3],
  '@media': {
    'only screen and (min-width: 500px)': {
      border: `1px solid ${tokens.colors.background}`,
    },
  },
});
