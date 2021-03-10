import { createGlobalTheme, createTheme, style } from '@mattsjones/css-core';

export const theme = style({});

// TODO: Do we need a dot here?
export const vars = createGlobalTheme(`:root, .${theme}`, {
  colors: {
    background: 'blue',
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
    background: 'green',
    text: 'white',
  },
  space: {
    1: '8px',
    2: '12px',
    3: '16px',
  },
});
