import { style, assignVars } from '@vanilla-extract/css';
import { componentContract } from './a.css';

export const b = style({
  vars: assignVars(componentContract.color, {
    primary: 'red',
  }),
});
