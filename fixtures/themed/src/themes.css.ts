import {
  createGlobalTheme,
  createTheme,
  assignVars,
  style,
  layer,
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

const themeLayer = layer();

// Not tested visually, exported for CSS output testing
export const [altTheme2Class, altTheme2Contract] = createTheme({
  '@layer': themeLayer,
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

// Not tested visually, exported for CSS output testing
export const altTheme3 = createGlobalTheme(':root', altTheme2Contract, {
  '@layer': 'globalThemeLayer',
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
