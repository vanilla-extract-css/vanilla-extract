import { ConditionalAtomicStyles, ConditionalProperty } from './types';

type ConditionalValue = any;

export function createNormalizeConditionalValue(
  atomicStyles: ConditionalAtomicStyles,
) {
  const { conditions } = atomicStyles;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  function normalize(value: ConditionalValue) {
    if (typeof value === 'string') {
      if (!conditions.defaultCondition) {
        throw new Error('No default condition');
      }

      return { [conditions.defaultCondition]: value };
    }

    if (Array.isArray(value)) {
      if (!conditions.responsiveArray) {
        throw new Error('Responsive arrays are not supported');
      }

      let returnValue = {};
      for (const index in conditions.responsiveArray) {
        if (value[index] != null) {
          returnValue[conditions.responsiveArray[index]] = value[index];
        }
      }

      return returnValue;
    }

    return value;
  }

  Object.defineProperty(normalize, '__recipe__', {
    value: {
      importPath: '@vanilla-extract/sprinkles/createUtils',
      importName: 'createNormalizeConditionalValue',
      args: [atomicStyles],
    },
    writable: false,
  });

  return normalize;
}

export function createUtils(atomicStyles: ConditionalAtomicStyles) {
  return {
    normalize: createNormalizeConditionalValue(atomicStyles),
  };
}
