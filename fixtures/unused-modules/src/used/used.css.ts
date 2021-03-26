import { style } from '@mattsjones/css-core';
import { sharedStyle } from '../shared';

const className = style({
  height: 100,
  width: 100,
  background: 'green',
});

export default `${className} ${sharedStyle}`;
