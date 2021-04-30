import { createVar } from '@vanilla-extract/css';
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
    top: [0],
    paddingLeft: spacing,
    paddingRight: spacing,
  },
});

export const atomicWithShorthandStyles = createAtomicStyles({
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
    anotherPaddingX: ['paddingLeft', 'paddingRight'],
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

export const conditionalStylesWithoutDefaultCondition = createAtomicStyles({
  defaultCondition: false,
  conditions: {
    active: {
      selector: '&:active',
    },
  },
  properties: {
    transform: {
      shrink: 'scale(0.8)',
    },
  },
});

export const conditionalStylesWithoutResponsiveArray = createAtomicStyles({
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: {},
    desktop: {
      '@media': 'screen and (min-width: 786px)',
    },
  },
  properties: {
    marginTop: spacing,
  },
  shorthands: {
    marginY: ['marginTop'],
  },
});

export const atomicWithPaddingShorthandStyles = createAtomicStyles({
  properties: {
    paddingLeft: spacing,
    paddingRight: spacing,
    paddingTop: spacing,
    paddingBottom: spacing,
    fontWeight: [createVar()],
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
  },
});
