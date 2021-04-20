import { createAtomicStyles } from '@vanilla-extract/sprinkles';

export const a = createAtomicStyles({
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: {
      '@media': 'screen and (min-width: 768px)',
    },
    desktop: {
      '@media': 'screen and (min-width: 1024px)',
    },
    darkDesktop: {
      '@supports': 'not (display: grid)',
      '@media': 'screen and (min-width: 1024px)',
      selector: '[data-dark-mode] &',
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
