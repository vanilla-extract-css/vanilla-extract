import { shadow } from './shared.treat';
import { style } from '@treat/core';
import { theme } from './themes.treat';

export const button = [
  style({
    backgroundColor: theme.vars.colors.background,
    color: theme.vars.colors.text,
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
  gap: theme.vars.space[2],
  padding: theme.vars.space[3],
  '@media': {
    'only screen and (min-width: 500px)': {
      border: `1px solid ${theme.vars.colors.background}`,
    },
  },
});
