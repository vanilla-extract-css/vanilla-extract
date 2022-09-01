import { style, createVar } from '@vanilla-extract/css';

const color = createVar();

export const container = style({
  containerType: 'size',
  containerName: 'container',
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
        'container (min-width: 400px)': {
          color: 'white',
        },
      },
    },
  },
});
