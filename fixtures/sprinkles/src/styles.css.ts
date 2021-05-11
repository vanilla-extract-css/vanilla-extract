import {
  createAtomicStyles,
  createAtomsFn,
  createUtils,
} from '@vanilla-extract/sprinkles';

const responsiveStyles = createAtomicStyles({
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
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['flex', 'none', 'block'],
    paddingTop: {
      small: '10px',
      medium: '20px',
    },
  },
});

export const responsiveValue = createUtils(responsiveStyles);

export const atoms = createAtomsFn(responsiveStyles);
