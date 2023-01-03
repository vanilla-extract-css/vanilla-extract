import { style, globalStyle, layer, globalLayer } from '@vanilla-extract/css';

const lib = globalLayer('lib');

const base = layer({ parent: lib });
const typography = layer({ parent: lib });
const utilities = layer({ parent: lib });

globalStyle('a', {
  '@layer': {
    [typography]: {
      '@media': {
        'screen and (min-width: 600px)': {
          color: 'green', // styles *all* links
        },
      },
    },
    [base]: {
      fontWeight: 800,
      color: 'red',
    },
  },
});

export const link = style({
  '@layer': {
    [base]: {
      color: 'blue',
    },
  },
});

export const pink = style({
  '@layer': {
    [utilities]: {
      color: 'hotpink', // styles *all* .pink's
    },
  },
});
