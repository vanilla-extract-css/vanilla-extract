import { style, globalStyle, layer, globalLayer } from '@vanilla-extract/css';

const lib = globalLayer('lib');
const resetLayer = layer({ parent: lib }, 'reset');
const typographyLayer = layer({ parent: lib });

const appLayer = layer();

export const textApp = style({
  '@layer': {
    [appLayer]: {
      backgroundColor: 'indigo',
      color: 'white',
    },
  },
});

export const textBase = style({
  '@layer': {
    [typographyLayer]: {
      backgroundColor: 'orange',
      color: 'aquamarine',
    },
  },
});

export const textReset = style({
  '@layer': {
    [resetLayer]: {
      color: 'magenta',
      textDecoration: 'underline',
      '@media': {
        'screen and (min-width: 600px)': {
          color: 'green',
        },
      },
    },
  },
});

globalStyle('p.reset', {
  '@layer': {
    [resetLayer]: {
      color: 'orange',
    },
  },
});
