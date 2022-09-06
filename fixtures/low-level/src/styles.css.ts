import { style, createVar, createContainer } from '@vanilla-extract/css';

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
