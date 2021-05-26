/*
    This file is for validating types, it is not designed to be executed
*/
import {
  createAtomicStyles,
  createMapValueFn,
  createNormalizeValueFn,
  ConditionalValue,
  RequiredConditionalValue,
} from '@vanilla-extract/sprinkles';
import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
  conditionalStylesWithoutDefaultCondition,
  conditionalStylesWithoutResponsiveArray,
} from './index.css';

// @ts-expect-error Unused args
const noop = (...args: Array<any>) => {};

() => {
  const atoms = createAtomsFn(
    atomicWithShorthandStyles,
    conditionalAtomicStyles,
    conditionalStylesWithoutDefaultCondition,
    conditionalStylesWithoutResponsiveArray,
  );

  atoms({
    // @ts-expect-error Invalid value
    paddingTop: 'mediumm',
  });

  atoms({
    paddingTop: {
      // @ts-expect-error Invalid condition name
      mobie: 'medium',
    },
  });

  atoms({
    // @ts-expect-error No responsive array defintion
    paddingLeft: ['medium'],
  });

  atoms({
    // @ts-expect-error Invalid responsive array value
    paddingTop: ['medium', 'smalll'],
  });

  atoms({
    // @ts-expect-error Shorthand with invalid value
    paddingY: 'mediumm',
  });

  atoms({
    // @ts-expect-error Shorthand with invalid conditional value
    paddingTop: {
      mobile: 'mediumm',
    },
  });

  atoms({
    paddingY: {
      // @ts-expect-error Shorthand with invalid condition name
      mobie: 'medium',
    },
  });

  atoms({
    // @ts-expect-error Shorthand with invalid conditional value
    paddingY: {
      mobile: 'mediumm',
    },
  });

  atoms({
    paddingY: {
      // @ts-expect-error Shorthand with invalid condition name
      mobie: 'medium',
    },
  });

  atoms({
    // @ts-expect-error Shorthand with invalid responsive array value
    paddingY: ['medium', 'smalll'],
  });

  // Valid value - Accept readonly arrays
  atoms({
    paddingY: ['medium', 'small'] as const,
  });

  // Valid value
  atoms({
    transform: {
      active: 'shrink',
    },
  });

  atoms({
    // @ts-expect-error No default class allowed
    transform: 'shrink',
  });

  // Valid value - shorthand conditional without responsive array
  atoms({
    marginY: { mobile: 'medium' },
  });

  // @ts-expect-error - Property defined with numbers should not allow array methods
  atoms({ opacity: 'forEach' });

  const atomicConfig = {
    properties: {
      flexDirection: ['row', 'column'],
    },
  } as const;

  // Valid value - config defined outside the createAtomicStyles function
  createAtomicStyles(atomicConfig);

  const mapValue = createMapValueFn(conditionalAtomicStyles);
  const normalizeValue = createNormalizeValueFn(conditionalAtomicStyles);

  // @ts-expect-error - Too many responsive array options
  normalizeValue(['one', 'two', 'three', 'four']);

  normalizeValue({
    // @ts-expect-error - Incorrect conditional keys
    mobille: '',
  });

  function testGenericNormalizeValue<Key extends string | number>(
    value: ResponsiveValue<Key>,
  ): Key | undefined {
    const normalizedValue = normalizeValue(value);
    // Should return the Key type for each condition when normalizing
    return normalizedValue.mobile;
  }
  testGenericNormalizeValue('');

  // @ts-expect-error - Strings shouldn't map to objects
  mapValue(alignProp, () => 'baz').mobile;

  // @ts-expect-error - Numbers shouldn't map to objects
  mapValue(3, () => 4).mobile;

  const mapValueWithoutDefaultCondition = createMapValueFn(
    conditionalStylesWithoutDefaultCondition,
  );
  const normalizeValueWithoutDefaultCondition = createNormalizeValueFn(
    conditionalStylesWithoutDefaultCondition,
  );

  // @ts-expect-error - Should force conditional value as no default condition
  normalizeValueWithoutDefaultCondition('test');

  // @ts-expect-error - Should force conditional value as no default condition
  mapValueWithoutDefaultCondition('test');

  type ResponsiveValue<Value extends string | number> = ConditionalValue<
    typeof conditionalAtomicStyles,
    Value
  >;

  let responsiveValue: ResponsiveValue<'row' | 'column'>;

  // Valid values
  responsiveValue = 'row';
  responsiveValue = 'column';
  responsiveValue = [null];
  responsiveValue = ['row', 'column'];
  responsiveValue = ['row', null, 'column'];
  responsiveValue = {};
  responsiveValue = { mobile: 'row' };
  responsiveValue = { tablet: 'column' };
  responsiveValue = { desktop: 'column' };
  responsiveValue = {
    mobile: 'row',
    tablet: 'column',
  };
  responsiveValue = {
    mobile: 'row',
    tablet: 'column',
    desktop: 'row',
  };

  // Invalid values
  // @ts-expect-error
  responsiveValue = 'NOPE';
  // @ts-expect-error
  responsiveValue = 123;
  // @ts-expect-error
  responsiveValue = null;
  // @ts-expect-error
  responsiveValue = [];
  // @ts-expect-error
  responsiveValue = ['NOPE'];
  // @ts-expect-error
  responsiveValue = [123];
  responsiveValue = [
    'row',
    'row',
    'row',
    // @ts-expect-error
    'your',
    // @ts-expect-error
    'boat',
  ];
  // @ts-expect-error
  responsiveValue = { mobile: 'nope' };
  // @ts-expect-error
  responsiveValue = { mobile: 123 };
  // @ts-expect-error
  responsiveValue = { mobile: null };
  // @ts-expect-error
  responsiveValue = { NOPE: 123 };

  noop(responsiveValue);

  type RequiredResponsiveValue<
    Value extends string | number
  > = RequiredConditionalValue<typeof conditionalAtomicStyles, Value>;

  let requiredValue: RequiredResponsiveValue<'row' | 'column'>;

  // Valid values
  requiredValue = 'row';
  requiredValue = { mobile: 'row' };
  requiredValue = { mobile: 'row', desktop: 'column' };
  requiredValue = ['row'];
  requiredValue = ['row', null, 'column'];

  // @ts-expect-error
  requiredValue = [];
  // @ts-expect-error
  requiredValue = [null];
  // @ts-expect-error
  requiredValue = [null, 'column'];
  // @ts-expect-error
  requiredValue = [null, null, 'column'];
  // @ts-expect-error
  requiredValue = {};
  // @ts-expect-error
  requiredValue = { desktop: 'column' };

  noop(requiredValue);

  // Ensure type is 'never' when default condition is missing
  type InvalidRequiredResponsiveValue<
    Value extends string | number
  > = RequiredConditionalValue<
    typeof conditionalStylesWithoutDefaultCondition,
    Value
  >;

  const invalidRequiredValue: InvalidRequiredResponsiveValue<
    'row' | 'column'
    // @ts-expect-error
  > = ['row'];

  noop(invalidRequiredValue);
};
