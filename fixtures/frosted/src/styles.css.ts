import { style } from '@vanilla-extract/css';
import { createPattern } from '@vanilla-extract/frosted';

const reset = style({
  border: 0,
});

export const button = createPattern({
  backgroundColor: 'powderblue',
  color: 'white',
  borderRadius: '6px',
  composes: [reset],

  variants: {
    size: {
      small: {
        fontSize: '16px',
        height: '24px',
      },
      standard: {
        fontSize: '24px',
        height: '40px',
      },
    },
  },

  defaultVariants: {
    size: 'standard',
  },
});
