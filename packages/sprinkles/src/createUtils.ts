import { addRecipe } from '@vanilla-extract/css/recipe';
import {
  ResponsiveArrayByMaxLength,
  RequiredResponsiveArrayByMaxLength,
} from './types';

type ExtractValue<
  Value extends
    | string
    | number
    | Partial<Record<string, string | number>>
    | ResponsiveArrayByMaxLength<number, string | number | null>,
> = Value extends ResponsiveArrayByMaxLength<number, string | number | null>
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

type ExtractDefaultCondition<AtomicStyles extends Conditions<string>> =
  AtomicStyles['conditions']['defaultCondition'];

type ExtractConditionNames<AtomicStyles extends Conditions<string>> =
  AtomicStyles['conditions']['conditionNames'][number];

export type ConditionalValue<
  AtomicStyles extends Conditions<string>,
  Value extends string | number,
> =
  | (ExtractDefaultCondition<AtomicStyles> extends false ? never : Value)
  | Partial<Record<ExtractConditionNames<AtomicStyles>, Value>>
  | (AtomicStyles['conditions']['responsiveArray'] extends { length: number }
      ? ResponsiveArrayByMaxLength<
          AtomicStyles['conditions']['responsiveArray']['length'],
          Value
        >
      : never);

type RequiredConditionalObject<
  RequiredConditionName extends string,
  OptionalConditionNames extends string,
  Value extends string | number,
> = Record<RequiredConditionName, Value> &
  Partial<Record<OptionalConditionNames, Value>>;

export type RequiredConditionalValue<
  AtomicStyles extends Conditions<string>,
  Value extends string | number,
> = ExtractDefaultCondition<AtomicStyles> extends false
  ? never
  :
      | Value
      | RequiredConditionalObject<
          Exclude<ExtractDefaultCondition<AtomicStyles>, false>,
          Exclude<
            ExtractConditionNames<AtomicStyles>,
            ExtractDefaultCondition<AtomicStyles>
          >,
          Value
        >
      | (AtomicStyles['conditions']['responsiveArray'] extends {
          length: number;
        }
          ? RequiredResponsiveArrayByMaxLength<
              AtomicStyles['conditions']['responsiveArray']['length'],
              Value
            >
          : never);

export function createNormalizeValueFn<AtomicStyles extends Conditions<string>>(
  atomicStyles: AtomicStyles,
): <Value extends string | number>(
  value: ConditionalValue<AtomicStyles, Value>,
) => Partial<Record<ExtractConditionNames<AtomicStyles>, Value>> {
  const { conditions } = atomicStyles;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  function normalizeValue(value: any) {
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

      const returnValue: Record<string, string> = {};
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

  return addRecipe(normalizeValue, {
    importPath: '@vanilla-extract/sprinkles/createUtils',
    importName: 'createNormalizeValueFn',
    args: [{ conditions: atomicStyles.conditions }],
  });
}

export function createMapValueFn<AtomicStyles extends Conditions<string>>(
  atomicStyles: AtomicStyles,
): <
  OutputValue extends string | number | boolean | null | undefined,
  Value extends ConditionalValue<AtomicStyles, string | number>,
>(
  value: Value,
  fn: (
    inputValue: ExtractValue<Value>,
    key: ExtractConditionNames<AtomicStyles>,
  ) => OutputValue,
) => Value extends string | number
  ? OutputValue
  : Partial<Record<ExtractConditionNames<AtomicStyles>, OutputValue>> {
  const { conditions } = atomicStyles;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  const normalizeValue = createNormalizeValueFn(atomicStyles);

  function mapValue(value: any, mapFn: any) {
    if (typeof value === 'string' || typeof value === 'number') {
      if (!conditions.defaultCondition) {
        throw new Error('No default condition');
      }

      return mapFn(value, conditions.defaultCondition);
    }

    const normalizedObject = Array.isArray(value)
      ? normalizeValue(value as any)
      : value;

    const mappedObject: Record<string, string> = {};

    for (const key in normalizedObject) {
      if (normalizedObject[key] != null) {
        mappedObject[key] = mapFn(normalizedObject[key], key);
      }
    }

    return mappedObject;
  }

  return addRecipe(mapValue, {
    importPath: '@vanilla-extract/sprinkles/createUtils',
    importName: 'createMapValueFn',
    args: [{ conditions: atomicStyles.conditions }],
  });
}
