import { style } from '@vanilla-extract/css';
import type * as CSS from 'csstype';

import { ResponsiveArrayConfig } from './types';

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

type BaseConditions = Record<string, Condition>;

interface BaseAtomicOptions {
  properties: {
    [Property in keyof CSS.Properties]?:
      | Record<string, CSS.Properties[Property]>
      | Array<CSS.Properties[Property]>;
  };
}

interface AtomicOptions extends BaseAtomicOptions {
  defaultCondition?: never;
  conditions?: never;
  responsiveArray?: never;
}
interface ConditionalAtomicOptions<Conditions extends BaseConditions>
  extends BaseAtomicOptions {
  conditions: Conditions;
  defaultCondition: keyof Conditions | false;
  responsiveArray?: ResponsiveArrayConfig<keyof Conditions>;
}

type AtomicStyles<Options extends BaseAtomicOptions, Result = string> = {
  [Property in keyof Options['properties']]: {
    [Variant in Options['properties'][Property] extends Array<any>
      ? Options['properties'][Property][number]
      : keyof Options['properties'][Property]]: Result;
  };
};

type ConditionalAtomicStyles<
  Conditions extends BaseConditions,
  Options extends ConditionalAtomicOptions<Conditions>
> = AtomicStyles<
  Options,
  {
    defaultCondition?: string;
    conditions: {
      [Rule in keyof Options['conditions']]: string;
    };
    responsiveArray: Options['responsiveArray'];
  }
>;

export function createAtomicStyles<Options extends AtomicOptions>(
  options: Options,
): AtomicStyles<Options>;
export function createAtomicStyles<
  Conditions extends BaseConditions,
  Options extends ConditionalAtomicOptions<Conditions>
>(options: Options): ConditionalAtomicStyles<Conditions, Options>;
export function createAtomicStyles(
  options: AtomicOptions | ConditionalAtomicOptions<BaseConditions>,
): any {
  let styles = {} as any;

  for (const key in options.properties) {
    const property = options.properties[key as keyof typeof options.properties];
    styles[key] = {};

    const processVariant = (
      variantName: keyof typeof property,
      value: string,
    ) => {
      if (typeof options.conditions === 'object') {
        styles[key][variantName] = {
          conditions: {},
        };

        for (const conditionName in options.conditions) {
          const condition =
            options.conditions[
              conditionName as keyof typeof options.conditions
            ];

          let styleValue = {
            [key]: value,
          } as any;

          if (condition['@supports']) {
            styleValue = {
              '@supports': {
                [condition['@supports']]: styleValue,
              },
            };
          }

          if (condition['@media']) {
            styleValue = {
              '@media': {
                [condition['@media']]: styleValue,
              },
            };
          }

          if (condition.selector) {
            styleValue = {
              selectors: {
                [condition.selector]: styleValue,
              },
            };
          }

          const className = style(styleValue);

          styles[key][variantName].conditions[conditionName] = className;

          if (conditionName === options.defaultCondition) {
            styles[key][variantName].defaultCondition = className;
          }

          if (options.responsiveArray) {
            styles[key][variantName].responsiveArray = options.responsiveArray;
          }
        }
      } else {
        styles[key][variantName] = style({
          [key]: value,
        });
      }
    };

    if (Array.isArray(property)) {
      for (const variant of property) {
        // @ts-expect-error
        processVariant(variant, variant);
      }
    } else {
      for (const variantName in property) {
        const variant = property[variantName];
        // @ts-expect-error
        processVariant(variantName, variant);
      }
    }
  }

  return styles;
}
