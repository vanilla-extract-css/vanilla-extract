import { style, layer, globalLayer, commitLayers } from '@vanilla-extract/css';

export const lib = globalLayer({ commit: false }, 'lib');

export const baseLayer = layer({ parent: lib, commit: false });
export const typographyLayer = layer({ parent: lib, commit: false });
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

///////

const REORDER = true;

let myStuff: string;

if (REORDER) {
  myStuff = layer({ parent: lib, commit: false });

  // insert my layer in between library layers
  commitLayers([baseLayer, myStuff, typographyLayer]);
} else {
  // use default layer order
  commitLayers(libLayers);

  myStuff = layer({ parent: lib });
}

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
