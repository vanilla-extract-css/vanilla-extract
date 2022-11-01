import { style, globalStyle, layer, globalLayer } from '@vanilla-extract/css';

const lib = globalLayer('lib');
const resetLayer = layer({ parent: lib }, 'reset');
const typographyLayer = layer({ parent: lib });

const appLayer = layer();

export const textVariant = style({
  '@layer': {
    [appLayer]: {
      color: 'indigo',
    },
  },
});

export const textBase = style({
  '@layer': {
    [typographyLayer]: {
      color: 'aquamarine',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
    },
  },
});

export const textReset = style({
  '@layer': {
    [resetLayer]: {
      '@layer': {
        infinite: {
          '@layer': {
            nesting: {
              color: 'magenta',
              textDecoration: 'underline',
            },
          },
        },
      },
      '@media': {
        'screen and (min-width: 200px)': {
          color: 'green',
        },
      },
    },
  },
});

globalStyle('p', {
  '@layer': {
    [resetLayer]: {
      color: 'yellow',
      textDecoration: 'underline',
    },
  },
});
