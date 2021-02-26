import { mainTheme } from './themes.treat';

const { style } = mainTheme;

export const button = style((theme, utils) => ({
  backgroundColor: theme.colors.primary,
  color: theme.colors.secondary,
  ...utils.paddingX(3),
}));

export const rows = style((theme) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space[2],
}));
