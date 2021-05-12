import { addRecipe } from '@vanilla-extract/css/recipe';
import { ResponsiveArray } from './types';

type ExtractValue<
  Value extends
    | string
    | number
    | Partial<Record<string, string | number>>
    | ResponsiveArray<number, string | number | null>
> = Value extends ResponsiveArray<number, string | number | null>
  ? NonNullable<Value[number]>
  : Value extends Partial<Record<string, string | number>>
  ? Value[keyof Value]
  : Value;

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
      | ResponsiveArray<ResponsiveLength, Value | null>
      | Partial<Record<ConditionName, Value>>,
  ) => Partial<Record<ConditionName, Value>>;
  map: <
    OutputValue extends string | number,
    Value extends
      | (DefaultCondition extends false ? never : string | number)
      | ResponsiveArray<ResponsiveLength, string | number | null>
      | Partial<Record<ConditionName, string | number>>
  >(
    value: Value,
    fn: (inputValue: ExtractValue<Value>, key: ConditionName) => OutputValue,
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
    OutputValue extends string | number,
    Value extends
      | (DefaultCondition extends false ? never : string | number)
      | Partial<Record<ConditionName, string | number>>
  >(
    value: Value,
    fn: (inputValue: ExtractValue<Value>, key: ConditionName) => OutputValue,
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

    for (const key in normalizedObject) {
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
