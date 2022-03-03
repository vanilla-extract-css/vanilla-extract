import { addRecipe } from '@vanilla-extract/css/recipe';
import {
  ResponsiveArrayByMaxLength,
  RequiredResponsiveArrayByMaxLength,
} from './types';

type ExtractValue<
  Value extends
    | string
    | number
    | boolean
    | Partial<Record<string, string | number | boolean>>
    | ResponsiveArrayByMaxLength<number, string | number | boolean | null>,
> = Value extends ResponsiveArrayByMaxLength<
  number,
  string | number | boolean | null
>
  ? NonNullable<Value[number]>
  : Value extends Partial<Record<string, string | number | boolean>>
  ? NonNullable<Value[keyof Value]>
  : Value;

type Conditions<ConditionName extends string> = {
  conditions: {
    defaultCondition: ConditionName | false;
    conditionNames: Array<ConditionName>;
    responsiveArray?: Array<ConditionName>;
  };
};

type ExtractDefaultCondition<SprinklesProperties extends Conditions<string>> =
  SprinklesProperties['conditions']['defaultCondition'];

type ExtractConditionNames<SprinklesProperties extends Conditions<string>> =
  SprinklesProperties['conditions']['conditionNames'][number];

export type ConditionalValue<
  SprinklesProperties extends Conditions<string>,
  Value extends string | number | boolean,
> =
  | (ExtractDefaultCondition<SprinklesProperties> extends false ? never : Value)
  | Partial<Record<ExtractConditionNames<SprinklesProperties>, Value>>
  | (SprinklesProperties['conditions']['responsiveArray'] extends {
      length: number;
    }
      ? ResponsiveArrayByMaxLength<
          SprinklesProperties['conditions']['responsiveArray']['length'],
          Value
        >
      : never);

type RequiredConditionalObject<
  RequiredConditionName extends string,
  OptionalConditionNames extends string,
  Value extends string | number | boolean,
> = Record<RequiredConditionName, Value> &
  Partial<Record<OptionalConditionNames, Value>>;

export type RequiredConditionalValue<
  SprinklesProperties extends Conditions<string>,
  Value extends string | number | boolean,
> = ExtractDefaultCondition<SprinklesProperties> extends false
  ? never
  :
      | Value
      | RequiredConditionalObject<
          Exclude<ExtractDefaultCondition<SprinklesProperties>, false>,
          Exclude<
            ExtractConditionNames<SprinklesProperties>,
            ExtractDefaultCondition<SprinklesProperties>
          >,
          Value
        >
      | (SprinklesProperties['conditions']['responsiveArray'] extends {
          length: number;
        }
          ? RequiredResponsiveArrayByMaxLength<
              SprinklesProperties['conditions']['responsiveArray']['length'],
              Value
            >
          : never);

export function createNormalizeValueFn<
  SprinklesProperties extends Conditions<string>,
>(
  properties: SprinklesProperties,
): <Value extends string | number | boolean>(
  value: ConditionalValue<SprinklesProperties, Value>,
) => Partial<Record<ExtractConditionNames<SprinklesProperties>, Value>> {
  const { conditions } = properties;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  function normalizeValue(value: any) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
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
    args: [{ conditions: properties.conditions }],
  });
}

export function createMapValueFn<
  SprinklesProperties extends Conditions<string>,
>(
  properties: SprinklesProperties,
): <
  OutputValue extends string | number | boolean | null | undefined,
  Value extends ConditionalValue<
    SprinklesProperties,
    string | number | boolean
  >,
>(
  value: Value,
  fn: (
    inputValue: ExtractValue<Value>,
    key: ExtractConditionNames<SprinklesProperties>,
  ) => OutputValue,
) => Value extends string | number | boolean
  ? OutputValue
  : Partial<Record<ExtractConditionNames<SprinklesProperties>, OutputValue>> {
  const { conditions } = properties;

  if (!conditions) {
    throw new Error('Styles have no conditions');
  }

  const normalizeValue = createNormalizeValueFn(properties);

  function mapValue(value: any, mapFn: any) {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
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
    args: [{ conditions: properties.conditions }],
  });
}
