import { createAtomicStyles } from '@vanilla-extract/sprinkles';

const spacing = {
  small: '4px',
  medium: '8px',
  large: '16px',
};

export const atomicStyles = createAtomicStyles({
  properties: {
    color: {
      'gray-500': '#6B7280',
      'red-500': '#EF4444',
      'green-300': '#6EE7B7',
    },
    paddingLeft: spacing,
    paddingRight: spacing,
  },
  shorthands: {
    paddingX: ['paddingLeft', 'paddingRight'],
  },
});

export const conditionalAtomicStyles = createAtomicStyles({
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: {},
    desktop: {
      '@media': 'screen and (min-width: 786px)',
    },
  },
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['block', 'none', 'flex'],
    paddingTop: spacing,
    paddingBottom: spacing,
  },
  shorthands: {
    paddingY: ['paddingBottom', 'paddingTop'],
  },
});
