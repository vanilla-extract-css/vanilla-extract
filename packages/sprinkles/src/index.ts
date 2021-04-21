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

type Values<Property, Result> = {
  [Value in Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result;
};

type UnconditionalAtomicStyles<Options extends AtomicOptions> = {
  [Property in keyof Options['properties']]: {
    values: Values<Options['properties'][Property], { defaultClass: string }>;
  };
};

type ConditionalAtomicStyles<
  Conditions extends BaseConditions,
  Options extends ConditionalAtomicOptions<Conditions>
> = {
  [Property in keyof Options['properties']]: {
    responsiveArray: Array<keyof Conditions>;
    values: Values<
      Options['properties'][Property],
      {
        defaultClass: string;
        conditions: {
          [Rule in keyof Options['conditions']]: string;
        };
      }
    >;
  };
};

export function createAtomicStyles<Options extends AtomicOptions>(
  options: Options,
): UnconditionalAtomicStyles<Options>;
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
    styles[key] = {
      values: {},
    };

    if (options.responsiveArray) {
      styles[key].responsiveArray = options.responsiveArray;
    }

    const processValue = (valueName: keyof typeof property, value: string) => {
      if (typeof options.conditions === 'object') {
        styles[key].values[valueName] = {
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

          styles[key].values[valueName].conditions[conditionName] = className;

          if (conditionName === options.defaultCondition) {
            styles[key].values[valueName].defaultClass = className;
          }
        }
      } else {
        styles[key].values[valueName] = {
          defaultClass: style({ [key]: value }),
        };
      }
    };

    if (Array.isArray(property)) {
      for (const value of property) {
        // @ts-expect-error
        processValue(value, value);
      }
    } else {
      for (const valueName in property) {
        const value = property[valueName];
        // @ts-expect-error
        processValue(valueName, value);
      }
    }
  }

  return styles;
}
