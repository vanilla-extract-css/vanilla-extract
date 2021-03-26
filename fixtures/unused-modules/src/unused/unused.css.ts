import { style } from '@mattsjones/css-core';
import { sharedStyle } from '../shared';

const className = style({
  color: 'red',
  backgroundColor: 'blue',
});

export default `${className} ${sharedStyle}`;
