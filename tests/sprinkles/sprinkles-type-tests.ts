/*
    This file is for validating types, it is not designed to be executed
*/
import {
  defineProperties,
  createMapValueFn,
  createNormalizeValueFn,
  ConditionalValue,
  RequiredConditionalValue,
} from '@vanilla-extract/sprinkles';
import { createSprinkles } from '@vanilla-extract/sprinkles';

import {
  propertiesWithShorthands,
  conditionalProperties,
  conditionalPropertiesWithoutDefaultCondition,
  conditionalPropertiesWithoutResponsiveArray,
} from './index.css';

// @ts-expect-error Unused args
const noop = (...args: Array<any>) => {};

() => {
  const sprinkles = createSprinkles(
    propertiesWithShorthands,
    conditionalProperties,
    conditionalPropertiesWithoutDefaultCondition,
    conditionalPropertiesWithoutResponsiveArray,
  );

  sprinkles({
    // @ts-expect-error Invalid value
    paddingTop: 'mediumm',
  });

  sprinkles({
    paddingTop: {
      // @ts-expect-error Invalid condition name
      mobie: 'medium',
    },
  });

  sprinkles({
    // @ts-expect-error No responsive array defintion
    paddingLeft: ['medium'],
  });

  sprinkles({
    // @ts-expect-error Invalid responsive array value
    paddingTop: ['medium', 'smalll'],
  });

  sprinkles({
    // @ts-expect-error Shorthand with invalid value
    paddingY: 'mediumm',
  });

  sprinkles({
    // @ts-expect-error Shorthand with invalid conditional value
    paddingTop: {
      mobile: 'mediumm',
    },
  });

  sprinkles({
    paddingY: {
      // @ts-expect-error Shorthand with invalid condition name
      mobie: 'medium',
    },
  });

  sprinkles({
    // @ts-expect-error Shorthand with invalid conditional value
    paddingY: {
      mobile: 'mediumm',
    },
  });

  sprinkles({
    paddingY: {
      // @ts-expect-error Shorthand with invalid condition name
      mobie: 'medium',
    },
  });

  sprinkles({
    // @ts-expect-error Shorthand with invalid responsive array value
    paddingY: ['medium', 'smalll'],
  });

  // Valid value - Accept readonly arrays
  sprinkles({
    paddingY: ['medium', 'small'] as const,
  });

  // Valid value
  sprinkles({
    transform: {
      active: 'shrink',
    },
  });

  sprinkles({
    // @ts-expect-error No default class allowed
    transform: 'shrink',
  });

  // Valid value - shorthand conditional without responsive array
  sprinkles({
    marginY: { mobile: 'medium' },
  });

  // @ts-expect-error - Property defined with numbers should not allow array methods
  sprinkles({ opacity: 'forEach' });

  const atomicProperties = {
    properties: {
      flexDirection: ['row', 'column'],
    },
  } as const;

  // Valid value - config defined outside the defineProperties function
  defineProperties(atomicProperties);

  const mapValue = createMapValueFn(conditionalProperties);
  const normalizeValue = createNormalizeValueFn(conditionalProperties);

  // @ts-expect-error - Too many responsive array options
  normalizeValue(['one', 'two', 'three', 'four']);

  normalizeValue({
    // @ts-expect-error - Incorrect conditional keys
    mobille: '',
  });

  function testGenericNormalizeValue<Key extends string | number | boolean>(
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
    conditionalPropertiesWithoutDefaultCondition,
  );
  const normalizeValueWithoutDefaultCondition = createNormalizeValueFn(
    conditionalPropertiesWithoutDefaultCondition,
  );

  // @ts-expect-error - Should force conditional value as no default condition
  normalizeValueWithoutDefaultCondition('test');

  // @ts-expect-error - Should force conditional value as no default condition
  mapValueWithoutDefaultCondition('test');

  type ResponsiveValue<Value extends string | number | boolean> =
    ConditionalValue<typeof conditionalProperties, Value>;

  let responsiveValue: ResponsiveValue<'row' | 'column' | boolean>;

  // Valid values
  responsiveValue = 'row';
  responsiveValue = 'column';
  responsiveValue = [null];
  responsiveValue = ['row', 'column'];
  responsiveValue = ['row', null, 'column'];
  responsiveValue = true;
  responsiveValue = false;
  responsiveValue = [false];
  responsiveValue = [false, null, true];
  responsiveValue = {};
  responsiveValue = { mobile: 'row' };
  responsiveValue = { tablet: 'column' };
  responsiveValue = { desktop: 'column' };
  responsiveValue = { mobile: true };
  responsiveValue = { mobile: false };
  responsiveValue = {
    mobile: 'row',
    tablet: 'column',
  };
  responsiveValue = {
    mobile: true,
    tablet: false,
  };
  responsiveValue = {
    mobile: 'row',
    tablet: 'column',
    desktop: 'row',
  };
  responsiveValue = {
    mobile: false,
    tablet: true,
    desktop: false,
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

  let requiredValue: RequiredConditionalValue<
    typeof conditionalProperties,
    'row' | 'column' | boolean
  >;

  // Valid values
  requiredValue = 'row';
  requiredValue = { mobile: 'row' };
  requiredValue = { mobile: 'row', desktop: 'column' };
  requiredValue = true;
  requiredValue = { mobile: false };
  requiredValue = { mobile: false, desktop: true };
  requiredValue = ['row'];
  requiredValue = ['row', null, 'column'];
  requiredValue = [false];
  requiredValue = [false, null, true];

  // @ts-expect-error
  requiredValue = [];
  // @ts-expect-error
  requiredValue = [null];
  // @ts-expect-error
  requiredValue = [null, 'column'];
  // @ts-expect-error
  requiredValue = [null, null, 'column'];
  // @ts-expect-error
  requiredValue = [null, null, true];
  // @ts-expect-error
  requiredValue = {};
  // @ts-expect-error
  requiredValue = { desktop: 'column' };
  // @ts-expect-error
  requiredValue = { desktop: true };

  noop(requiredValue);

  // Ensure type is 'never' when default condition is missing
  type InvalidRequiredResponsiveValue<Value extends string | number> =
    RequiredConditionalValue<
      typeof conditionalPropertiesWithoutDefaultCondition,
      Value
    >;

  const invalidRequiredValue: InvalidRequiredResponsiveValue<
    'row' | 'column'
    // @ts-expect-error
  > = ['row'];

  noop(invalidRequiredValue);

  sprinkles.conditions.has('mobile');
  sprinkles.conditions.has('tablet');
  sprinkles.conditions.has('desktop');
  // @ts-expect-error
  sprinkles.conditions.has('missingCondition');
};
