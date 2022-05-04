import { createVar, style } from '@vanilla-extract/css';
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import type { CSSProperties, StyleRule } from '@vanilla-extract/css';

import { createRuntimeFillings } from './createRuntimeFillings';
import type {
  BaseConditions,
  ConditionalFillingsConfig,
  FillingsConfig,
  FillingsFn,
} from './types';

export type { FillingsProps } from './types';

type CreateFillingsOptions<Property extends keyof CSSProperties> = {
  properties: readonly Property[];
};

type CreateConditionalFillingsOptions<
  Property extends keyof CSSProperties,
  Conditions extends BaseConditions,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = CreateFillingsOptions<Property> & {
  conditions: Conditions;
  defaultCondition: DefaultCondition;
};

export function createFillings<
  Property extends keyof CSSProperties,
  Conditions extends BaseConditions,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: CreateConditionalFillingsOptions<
    Property,
    Conditions,
    DefaultCondition
  >,
): FillingsFn<ConditionalFillingsConfig<Conditions, Property>>;
export function createFillings<Property extends keyof CSSProperties>(
  options: CreateFillingsOptions<Property>,
): FillingsFn<FillingsConfig<Property>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFillings(options: any) {
  // Conditional
  if (options.conditions && options.defaultCondition) {
    const { conditions, defaultCondition, properties } =
      options as CreateConditionalFillingsOptions<
        keyof CSSProperties,
        BaseConditions,
        keyof BaseConditions
      >;

    const definitions: ConditionalFillingsConfig<
      BaseConditions,
      string
    >['definitions'] = {};

    for (const property of properties) {
      definitions[property] = {};

      for (const conditionName in conditions) {
        const variable = createVar();

        let styleValue: StyleRule = { [property]: variable };

        const condition = conditions[conditionName];

        if ('@media' in condition) {
          styleValue =
            condition['@media'] === ''
              ? styleValue
              : {
                  '@media': {
                    [condition['@media']]: styleValue,
                  },
                };
        } else if ('@supports' in condition) {
          styleValue =
            condition['@supports'] === ''
              ? styleValue
              : {
                  '@supports': {
                    [condition['@supports']]: styleValue,
                  },
                };
        } else if ('selector' in condition) {
          styleValue =
            condition['selector'] === ''
              ? styleValue
              : {
                  selectors: {
                    [condition.selector]: styleValue,
                  },
                };
        }

        const className = style(
          styleValue,
          `fillings_${property}_${conditionName}`,
        );

        definitions[property][conditionName] = {
          variable,
          className,
        };
      }
    }

    const config = {
      defaultCondition,
      definitions,
      properties,
    } as ConditionalFillingsConfig<BaseConditions, string>;

    return addFunctionSerializer(createRuntimeFillings(config), {
      importPath: '@vanilla-extract/fillings/createRuntimeFillings',
      importName: 'createRuntimeFillings',
      args: [config],
    });
  }

  // Unconditional
  const { properties } = options as CreateFillingsOptions<keyof CSSProperties>;

  const definitions: FillingsConfig<string>['definitions'] = {};

  for (const property of properties) {
    const variable = createVar();

    const className = style(
      {
        [property]: variable,
      },
      `fillings_${property}`,
    );

    definitions[property] = {
      variable,
      className,
    };
  }

  const config = { definitions, properties } as FillingsConfig<string>;

  return addFunctionSerializer(createRuntimeFillings(config), {
    importPath: '@vanilla-extract/fillings/createRuntimeFillings',
    importName: 'createRuntimeFillings',
    args: [config],
  });
}
