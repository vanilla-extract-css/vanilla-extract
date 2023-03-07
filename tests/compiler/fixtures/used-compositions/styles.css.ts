import { style } from '@vanilla-extract/css';
import { sharedComposition } from './shared.css';

export { sharedComposition };

export const sharedCompositionBeingUsed = style({
  selectors: {
    [`${sharedComposition} &`]: {
      color: 'red',
    },
  },
});
