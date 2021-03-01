import { style } from '@treat/core';
import { theme } from './themes.treat';

export const button = style({
  backgroundColor: theme.vars.colors.background,
  color: theme.vars.colors.text,
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.vars.space[2],
  padding: theme.vars.space[3],
  border: `1px solid ${theme.vars.colors.background}`,
});
