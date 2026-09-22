/*
    This file is for validating types, it is not designed to be executed
*/
import {
  defineProperties,
  createMapValueFn,
  createNormalizeValueFn,
  type ConditionalValue,
  type RequiredConditionalValue,
} from '@vanilla-extract/sprinkles';
import { createSprinkles } from '@vanilla-extract/sprinkles';

import {
  propertiesWithShorthands,
  conditionalProperties,
  conditionalPropertiesWithoutDefaultCondition,
  conditionalPropertiesWithoutResponsiveArray,
  manyConditionsProperties,
} from './index.css';

const noop = (..._args: Array<any>) => {};

// oxlint-disable-next-line no-unused-expressions
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
  // oxlint-disable-next-line no-unused-expressions
  mapValue(alignProp, () => 'baz').mobile;

  // @ts-expect-error - Numbers shouldn't map to objects
  // oxlint-disable-next-line no-unused-expressions
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
  // @ts-expect-error
  responsiveValue = ['row', 'row', 'row', 'your', 'boat'];
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

  // @ts-expect-error
  const invalidRequiredValue: InvalidRequiredResponsiveValue<'row' | 'column'> =
    ['row'];

  noop(invalidRequiredValue);
};

/**
 * More than 8 conditions
 *
 * `conditions` (and therefore `responsiveArray`) used to be capped at 8 by
 * the types. These tests exercise a 12-condition config to make sure the cap
 * is gone while the connection between `conditions` and `responsiveArray`
 * (and the responsive array prop values) is preserved.
 */
// oxlint-disable-next-line no-unused-expressions
() => {
  const sprinkles = createSprinkles(manyConditionsProperties);

  // Valid value - default condition, no responsive syntax
  sprinkles({ display: 'flex' });

  // Valid value - conditions beyond the 8th are accepted as object keys
  sprinkles({
    display: {
      condition1: 'block',
      condition9: 'none',
      condition12: 'flex',
    },
  });

  sprinkles({
    display: {
      // @ts-expect-error Invalid condition name
      condition13: 'block',
    },
  });

  // Valid value - a responsive array with more than 8 (up to 12) elements.
  // (`@ts-expect-error` only suppresses the following line, so the array
  // literals below are kept on a single line to keep the directives accurate.)
  // prettier-ignore
  sprinkles({
    display: ['block', 'none', 'flex', 'block', 'none', 'flex', 'block', 'none', 'flex', 'block', 'none', 'flex'],
  });

  // Valid value - responsive array shorthand beyond 8 elements
  // prettier-ignore
  sprinkles({
    paddingY: ['small', 'medium', 'large', 'small', 'medium', 'large', 'small', 'medium', 'large', 'small', 'medium', 'large'],
  });

  // prettier-ignore
  sprinkles({
    // @ts-expect-error Too many responsive array values (13 > 12 conditions)
    display: ['block', 'none', 'flex', 'block', 'none', 'flex', 'block', 'none', 'flex', 'block', 'none', 'flex', 'block'],
  });

  // prettier-ignore
  sprinkles({
    // @ts-expect-error Invalid responsive array value beyond the 8th slot
    display: ['block', 'none', 'flex', 'block', 'none', 'flex', 'block', 'none', 'nope'],
  });

  // The connection between `conditions` and `responsiveArray` is maintained:
  // only condition names are valid `responsiveArray` elements. `responsiveArray`
  // is placed first so the caught error anchors to it rather than another prop.
  defineProperties({
    // @ts-expect-error 'd' is not a defined condition name
    responsiveArray: ['a', 'b', 'd'],
    defaultCondition: 'a',
    conditions: {
      a: {},
      b: { '@media': 'screen and (min-width: 200px)' },
      c: { '@media': 'screen and (min-width: 400px)' },
    },
    properties: {
      display: ['block', 'flex'],
    },
  });

  // A `responsiveArray` must contain at least two conditions.
  defineProperties({
    // @ts-expect-error A single-element responsive array is not allowed
    responsiveArray: ['a'],
    defaultCondition: 'a',
    conditions: {
      a: {},
      b: { '@media': 'screen and (min-width: 200px)' },
    },
    properties: {
      display: ['block', 'flex'],
    },
  });
};
