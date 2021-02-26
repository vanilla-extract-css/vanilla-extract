import { createTheme } from '@treat/core';

export const mainTheme = createTheme(
  {
    colors: {
      primary: 'blue',
      secondary: 'pink',
    },
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
    },
  },
  (theme) => ({
    paddingX: (space: number) => ({
      paddingLeft: theme.space[space],
      paddingRight: theme.space[space],
    }),
  }),
);

export const altTheme = mainTheme.alternate({
  colors: {
    primary: 'yellow',
    secondary: 'blue',
  },
  space: {
    1: '40px',
    2: '80px',
  },
});
