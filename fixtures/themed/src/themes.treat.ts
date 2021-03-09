import {
  createTokens,
  createGlobalTheme,
  createTheme,
  style,
} from '@mattsjones/css-core';

export const tokens = createTokens({
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

export const theme = style({});

createGlobalTheme(`:root, .${theme}`, tokens); // TODO: Do we need a dot here?

export const altTheme = createTheme(tokens, {
  colors: {
    background: 'green',
  },
  space: {
    1: '8px',
    2: '12px',
    3: '16px',
  },
});
