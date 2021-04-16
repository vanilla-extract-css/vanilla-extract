import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const a = createAtomicStyles({
  conditions: {
    mobile: {
      '@media': 'screen and (min-width: 768px)',
    },
  },
  properties: {
    display: ['flex', 'none', 'block'],
    paddingTop: {
      small: '10px',
      medium: '20px',
    },
  },
});
