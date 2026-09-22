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

// More than 8 conditions, to verify the responsive array types are no longer
// capped at 8. Kept last in this file so it doesn't shift the generated
// identifiers (and therefore snapshots) of the fixtures above it.
export const manyConditionsProperties = defineProperties({
  defaultCondition: 'condition1',
  conditions: {
    condition1: {},
    condition2: { '@media': 'screen and (min-width: 200px)' },
    condition3: { '@media': 'screen and (min-width: 400px)' },
    condition4: { '@media': 'screen and (min-width: 600px)' },
    condition5: { '@media': 'screen and (min-width: 800px)' },
    condition6: { '@media': 'screen and (min-width: 1000px)' },
    condition7: { '@media': 'screen and (min-width: 1200px)' },
    condition8: { '@media': 'screen and (min-width: 1400px)' },
    condition9: { '@media': 'screen and (min-width: 1600px)' },
    condition10: { '@media': 'screen and (min-width: 1800px)' },
    condition11: { '@media': 'screen and (min-width: 2000px)' },
    condition12: { '@media': 'screen and (min-width: 2200px)' },
  },
  responsiveArray: [
    'condition1',
    'condition2',
    'condition3',
    'condition4',
    'condition5',
    'condition6',
    'condition7',
    'condition8',
    'condition9',
    'condition10',
    'condition11',
    'condition12',
  ],
  properties: {
    display: ['block', 'none', 'flex'],
    paddingTop: spacing,
    paddingBottom: spacing,
  },
  shorthands: {
    paddingY: ['paddingTop', 'paddingBottom'],
  },
});
