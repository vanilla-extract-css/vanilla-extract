import { style } from '@vanilla-extract/css';
import asset from './square.svg';

export const square = style({
  width: '100px',
  height: '100px',
  backgroundImage: `url("${asset}")`,
  backgroundSize: 'cover',
});
