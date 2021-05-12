import {
  AtomicProperties,
  Condition,
  ConditionalAtomicStyles,
  ConditionalWithResponsiveArrayAtomicStyles,
  ResponsiveArray,
} from './types';

export function createNormalizeConditionalValue<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | false,
  Value extends string | number
>(
  atomicStyles: ConditionalAtomicStyles<
    Properties,
    Conditions,
    DefaultCondition
  >,
): (
  value: Value | { [conditionName in keyof Conditions]?: Value | null },
) => { [conditionName in keyof Conditions]: Value };
export function createNormalizeConditionalValue<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | false,
  Value extends string | number
>(
  atomicStyles: ConditionalWithResponsiveArrayAtomicStyles<
    Properties,
    Conditions,
    ResponsiveLength,
    DefaultCondition
  >,
): (
  value:
    | Value
    | ResponsiveArray<ResponsiveLength, Value>
    | { [conditionName in keyof Conditions]?: Value | null },
) => { [conditionName in keyof Conditions]: Value };
export function createNormalizeConditionalValue(
  atomicStyles:
    | ConditionalAtomicStyles<any, { [conditionName: string]: any }, any>
    | ConditionalWithResponsiveArrayAtomicStyles<
        any,
        { [conditionName: string]: any },
        any,
        any
      >,
) {
  const { conditions } = atomicStyles;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  function normalize(value: any) {
    if (typeof value === 'string') {
      if (!conditions.defaultCondition) {
        throw new Error('No default condition');
      }

      return { [conditions.defaultCondition]: value };
    }

    if (Array.isArray(value)) {
      if (!('responsiveArray' in conditions)) {
        throw new Error('Responsive arrays are not supported');
      }

      let returnValue: Record<string, string> = {};
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

export function createUtils(atomicStyles: any) {
  return {
    normalize: createNormalizeConditionalValue(atomicStyles),
  };
}
