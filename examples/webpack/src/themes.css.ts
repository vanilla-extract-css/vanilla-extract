import {
  createGlobalTheme,
  createTheme,
  assignVars,
  style,
} from '@vanilla-extract/css';

export const theme = style({});

export const vars = createGlobalTheme(`:root, ${theme}`, {
  colors: {
    backgroundColor: 'blue',
    text: 'white',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
  },
});

export const altTheme = createTheme(vars, {
  colors: {
    backgroundColor: 'green',
    text: 'white',
  },
  space: {
    1: '8px',
    2: '12px',
    3: '16px',
  },
});

export const responsiveTheme = style({
  vars: assignVars(vars, {
    colors: {
      backgroundColor: 'pink',
      text: 'purple',
    },
    space: {
      1: '6px',
      2: '12px',
      3: '18px',
    },
  }),
  '@media': {
    'screen and (min-width: 768px)': {
      vars: assignVars(vars.colors, {
        backgroundColor: 'purple',
        text: 'pink',
      }),
    },
  },
});
