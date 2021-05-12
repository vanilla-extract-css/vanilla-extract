/*
    This file is for validating types, it is not designed to be executed
*/
import { createAtomicStyles, createUtils } from '@vanilla-extract/sprinkles';
import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
  conditionalStylesWithoutDefaultCondition,
  conditionalStylesWithoutResponsiveArray,
} from './index.css';

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

  const utils = createUtils(conditionalAtomicStyles);

  // @ts-expect-error - Too many responsive array options
  utils.normalize(['one', 'two', 'three', 'four']);

  utils.normalize({
    // @ts-expect-error - Incorrect conditional keys
    mobille: '',
  });

  // @ts-expect-error - Strings shouldn't map to objects
  utils.map(alignProp, () => 'baz').mobile;

  // @ts-expect-error - Numbers shouldn't map to objects
  utils.map(3, () => 4).mobile;

  const noDefaultUtils = createUtils(conditionalStylesWithoutDefaultCondition);

  // @ts-expect-error - Should force conditional value as no default condition
  noDefaultUtils.normalize('test');

  // @ts-expect-error - Should force conditional value as no default condition
  noDefaultUtils.map('test');
};
