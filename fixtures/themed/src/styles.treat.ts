import { shadow } from './shared.treat';
import { style, setFileScope } from '@treat/core';
import { theme } from './themes.treat';

setFileScope('styles');

export const button = [
  style({
    backgroundColor: theme.vars.colors.background,
    color: theme.vars.colors.text,
  }),
  shadow,
];

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.vars.space[2],
  padding: theme.vars.space[3],
  '@media': {
    'screen and (min-width: 500px)': {
      border: `1px solid ${theme.vars.colors.background}`,
    },
  },
});
