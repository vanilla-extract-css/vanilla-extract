import { addRecipe } from '@vanilla-extract/css/recipe';
import { ResponsiveArray } from './types';

type ConditionsLookup<
  ConditionName extends string,
  DefaultCondition extends ConditionName | false
> = {
  conditions: {
    defaultCondition: DefaultCondition;
    conditionNames: Array<ConditionName>;
  };
};

type ConditionsLookupWithResponsiveArray<
  ConditionName extends string,
  DefaultCondition extends ConditionName | false,
  ResponsiveLength extends number
> = ConditionsLookup<ConditionName, DefaultCondition> & {
  conditions: {
    responsiveArray: Array<ConditionName> & { length: ResponsiveLength };
  };
};

export function createUtils<
  ConditionName extends string,
  ResponsiveLength extends number,
  DefaultCondition extends ConditionName | false
>(
  atomicStyles: ConditionsLookupWithResponsiveArray<
    ConditionName,
    DefaultCondition,
    ResponsiveLength
  >,
): {
  normalize: <Value extends string | number>(
    value:
      | (DefaultCondition extends false ? never : Value)
      | ResponsiveArray<ResponsiveLength, Value>
      | Partial<Record<ConditionName, Value>>,
  ) => Partial<Record<ConditionName, Value>>;
  map: <
    InputValue extends string | number,
    OutputValue extends string | number,
    Value extends
      | (DefaultCondition extends false ? never : InputValue)
      | ResponsiveArray<ResponsiveLength, InputValue>
      | Partial<Record<ConditionName, InputValue>>
  >(
    value: Value,
    fn: (inputValue: InputValue, key: ConditionName) => OutputValue,
  ) => Value extends string | number
    ? OutputValue
    : Partial<Record<ConditionName, OutputValue>>;
};
export function createUtils<
  ConditionName extends string,
  DefaultCondition extends ConditionName | false
>(
  atomicStyles: ConditionsLookup<ConditionName, DefaultCondition>,
): {
  normalize: <Value extends string | number>(
    value:
      | (DefaultCondition extends false ? never : Value)
      | Partial<Record<ConditionName, Value>>,
  ) => Partial<Record<ConditionName, Value>>;
  map: <
    InputValue extends string | number,
    OutputValue extends string | number,
    Value extends
      | (DefaultCondition extends false ? never : InputValue)
      | Partial<Record<ConditionName, InputValue>>
  >(
    value: Value,
    fn: (inputValue: InputValue, key: ConditionName) => OutputValue,
  ) => Value extends string | number
    ? OutputValue
    : Partial<Record<ConditionName, OutputValue>>;
};
export function createUtils(
  atomicStyles:
    | ConditionsLookup<string, string>
    | ConditionsLookupWithResponsiveArray<string, string, number>,
) {
  const { conditions } = atomicStyles;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  function normalize(value: any) {
    if (typeof value === 'string' || typeof value === 'number') {
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

  function map(value: any, mapFn: any) {
    if (typeof value === 'string' || typeof value === 'number') {
      if (!conditions.defaultCondition) {
        throw new Error('No default condition');
      }

      return mapFn(value, conditions.defaultCondition);
    }

    const normalizedObject = normalize(value);

    let mappedObject: Record<string, string> = {};

    for (const key of normalizedObject) {
      mappedObject[key] = mapFn(normalizedObject[key], key);
    }

    return mappedObject;
  }

  const utils = { normalize, map };

  return addRecipe(utils, {
    importPath: '@vanilla-extract/sprinkles/createUtils',
    importName: 'createUtils',
    args: [{ conditions: atomicStyles.conditions }],
  });
}
