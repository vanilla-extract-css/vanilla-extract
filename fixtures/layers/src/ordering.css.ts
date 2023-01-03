import { style, layer, globalLayer } from '@vanilla-extract/css';

export const lib = globalLayer('lib');

export const baseLayer = layer({ parent: lib });
export const typographyLayer = layer({ parent: lib });
export const libLayers = [baseLayer, typographyLayer];

const baseText = style({
  '@layer': {
    [baseLayer]: {
      color: 'papayawhip',
    },
  },
});

const typographyText = style({
  '@layer': {
    [typographyLayer]: {
      fontWeight: 'bold',
    },
  },
});

export const libText = style([baseText, typographyText]);

const myStuff = layer({ parent: lib });

export const myText = style([
  libText,
  {
    '@layer': {
      [myStuff]: {
        color: 'purple',
        fontWeight: 'normal',
      },
    },
  },
]);
