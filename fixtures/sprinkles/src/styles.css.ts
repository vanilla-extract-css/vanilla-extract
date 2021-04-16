import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const a = createAtomicStyles({
  conditions: {
    mobile: {},
    tablet: {
      '@media': 'screen and (min-width: 768px)',
    },
    desktop: {
      '@media': 'screen and (min-width: 1024px)',
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
