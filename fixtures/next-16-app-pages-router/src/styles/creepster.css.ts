import { style } from '@vanilla-extract/css';
import { creepster } from './creepster-font';

export const creepsterText = style({
  fontFamily: creepster.style.fontFamily,
  fontSize: '40px',
  color: 'red',
});
