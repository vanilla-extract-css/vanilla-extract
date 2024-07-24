import { style } from '@vanilla-extract/css';
import { base } from './base.css';
import { button } from './button.css';

export const stepperContainer = style([
  base,
  {
    fontSize: '32px',
  },
]);

export const stepperButton = style({
  selectors: {
    [`${stepperContainer} ${button}&`]: {
      border: '1px solid black',
    },
  },
});
