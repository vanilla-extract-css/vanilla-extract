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
  ? NonNullable<Value[keyof Value]>
  : Value;

type Conditions<ConditionName extends string> = {
  conditions: {
    defaultCondition: ConditionName | false;
    conditionNames: Array<ConditionName>;
    responsiveArray?: Array<ConditionName>;
  };
};

type ExtractDefaultCondition<
  AtomicStyles extends Conditions<string>
> = AtomicStyles['conditions']['defaultCondition'];

type ExtractConditionNames<
  AtomicStyles extends Conditions<string>
> = AtomicStyles['conditions']['conditionNames'][number];

export type ConditionalValue<AtomicStyles extends Conditions<string>, Value> =
  | (ExtractDefaultCondition<AtomicStyles> extends false ? never : Value)
  | Partial<Record<ExtractConditionNames<AtomicStyles>, Value>>
  | (AtomicStyles['conditions']['responsiveArray'] extends { length: number }
      ? ResponsiveArray<
          AtomicStyles['conditions']['responsiveArray']['length'],
          Value | null
        >
      : never);

export function createUtils<AtomicStyles extends Conditions<string>>(
  atomicStyles: AtomicStyles,
): {
  normalize: <Value extends string | number>(
    value: ConditionalValue<AtomicStyles, Value>,
  ) => Partial<Record<ExtractConditionNames<AtomicStyles>, Value>>;
  map: <
    OutputValue extends string | number,
    Value extends ConditionalValue<AtomicStyles, string | number>
  >(
    value: Value,
    fn: (
      inputValue: ExtractValue<Value>,
      key: ExtractConditionNames<AtomicStyles>,
    ) => OutputValue,
  ) => Value extends string | number
    ? OutputValue
    : Partial<Record<ExtractConditionNames<AtomicStyles>, OutputValue>>;
} {
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
      for (const index in conditions.responsiveArray as Array<string>) {
        if (value[index] != null) {
          returnValue[(conditions.responsiveArray as Array<string>)[index]] =
            value[index];
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

    const normalizedObject = Array.isArray(value) ? normalize(value) : value;

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
