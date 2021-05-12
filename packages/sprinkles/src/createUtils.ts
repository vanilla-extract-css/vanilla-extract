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
  DefaultCondition extends ConditionName | false
>(
  atomicStyles: ConditionsLookup<ConditionName, DefaultCondition>,
): {
  normalize: <Value extends string | number>(
    value: Value | Partial<Record<ConditionName, Value>>,
  ) => Partial<Record<ConditionName, Value>>;
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
      | Value
      | ResponsiveArray<ResponsiveLength, Value>
      | Partial<Record<ConditionName, Value>>,
  ) => Partial<Record<ConditionName, Value>>;
};
export function createUtils(
  atomicStyles:
    | ConditionsLookup<any, any>
    | ConditionsLookupWithResponsiveArray<any, any, any>,
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

  const utils = { normalize };

  return addRecipe(utils, {
    importPath: '@vanilla-extract/sprinkles/createUtils',
    importName: 'createUtils',
    args: [{ conditions: atomicStyles.conditions }],
  });
}
