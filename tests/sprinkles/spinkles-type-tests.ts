/*
    This file is for validating types, it is not designed to be executed
*/

import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
  conditionalStylesWithoutDefaultCondition,
} from './index.css';

() => {
  const atoms = createAtomsFn({
    ...atomicWithShorthandStyles,
    ...conditionalAtomicStyles,
    ...conditionalStylesWithoutDefaultCondition,
  });

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
};
