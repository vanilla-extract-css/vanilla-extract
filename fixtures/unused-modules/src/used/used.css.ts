import { style } from '@vanilla-extract/css';
import { sharedStyle } from '../shared';

const className = style({
  height: 100,
  width: 100,
  background: 'green',
});

export const usedStyle = `${className} ${sharedStyle}`;
