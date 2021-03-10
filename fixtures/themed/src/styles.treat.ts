import { style } from '@mattsjones/css-core';
import { shadow } from './shared.treat';
import { vars } from './themes.treat';

export const button = [
  style({
    backgroundColor: vars.colors.backgroundColor,
    color: vars.colors.text,
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
  gap: vars.space[2],
  padding: vars.space[3],
  '@media': {
    'only screen and (min-width: 500px)': {
      border: `1px solid ${vars.colors.backgroundColor}`,
    },
  },
});
