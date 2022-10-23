import {
  style,
  createVar,
  createContainer,
  createLayer,
  createLayers,
  globalStyle,
} from '@vanilla-extract/css';

const color = createVar();

const myContainer = createContainer('my-container');

export const container = style({
  containerType: 'size',
  containerName: myContainer,
  width: 500,
});

export const block = style({
  vars: {
    [color]: 'blue',
  },
  backgroundColor: color,
  padding: 20,
  '@media': {
    'screen and (min-width: 200px)': {
      '@container': {
        [`${myContainer} (min-width: 400px)`]: {
          color: 'white',
        },
      },
    },
  },
});

const [resetLayer, typographyLayer] = createLayers('reset', 'typography');
const componentsLayer = createLayer();

export const textVariant = style({
  '@layer': {
    [componentsLayer]: {
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
