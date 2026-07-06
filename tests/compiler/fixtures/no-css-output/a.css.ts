import {
  style,
  createGlobalThemeContract,
  assignVars,
} from '@vanilla-extract/css';
import { contract } from './contract.css';

export const componentContract = createGlobalThemeContract({
  color: {
    primary: 'component-token',
  },
});

export const a = style({
  vars: assignVars(componentContract.color, {
    primary: contract.color.primary,
  }),
});
