import { style, globalStyle, layer, globalLayer } from '@vanilla-extract/css';

/*
The resulting layer order:
1. lib
2. base
3. typography (when above 600px)
4. utilities
5. typography (when below 600px)

This will make links red/blue/pink when below 600px and green when above 600px.
*/

const typography = 'typography'; // this layer is defined conditionally

const lib = globalLayer('lib');
const base = layer({ parent: lib });

globalStyle('a', {
  '@media': {
    'screen and (min-width: 600px)': {
      '@layer': {
        [typography]: {
          color: 'green', // styles *all* links
          fontSize: '1.5rem',
        },
      },
    },
  },
  '@layer': {
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

const utilities = layer({ parent: lib });

export const pink = style({
  '@layer': {
    [utilities]: {
      color: 'hotpink', // styles *all* .pink's
    },
  },
});

globalLayer(typography);
