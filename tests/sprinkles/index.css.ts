import { createVar } from '@vanilla-extract/css';
import { defineProperties } from '@vanilla-extract/sprinkles';

const spacing = {
  small: '4px',
  medium: '8px',
  large: '16px',
};

export const basicProperties = defineProperties({
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

export const propertiesWithShorthands = defineProperties({
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

export const conditionalProperties = defineProperties({
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
    opacity: [0, 1] as const,
  },
  shorthands: {
    paddingY: ['paddingBottom', 'paddingTop'],
  },
});

export const conditionalPropertiesWithMultipleDefaultConditions =
  defineProperties({
    defaultCondition: ['lightMode', 'darkMode'],
    conditions: {
      lightMode: { '@media': '(prefers-color-scheme: light)' },
      darkMode: { '@media': '(prefers-color-scheme: dark)' },
    },
    properties: {
      background: ['red', 'green', 'blue'],
    },
  });

export const conditionalPropertiesWithoutDefaultCondition = defineProperties({
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

export const conditionalPropertiesWithoutResponsiveArray = defineProperties({
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

export const propertiesWithPaddingShorthands = defineProperties({
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

export const shorthandsWithZeroValues = defineProperties({
  properties: {
    marginTop: {
      0: '0rem',
      1: '0.5rem',
    },
  },
  shorthands: {
    mt: ['marginTop'],
  },
});
