import { style } from '@vanilla-extract/css';
import type * as CSS from 'csstype';

import { ResponsiveArrayConfig } from './types';

interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

type BaseConditions = { [conditionName: string]: Condition };

type AtomicProperties = {
  [Property in keyof CSS.Properties]?:
    | Record<string, CSS.Properties[Property]>
    | Array<CSS.Properties[Property]>;
};

type UnconditionalAtomicOptions<Properties extends AtomicProperties> = {
  properties: Properties;
};

type ConditionalAtomicOptions<
  Conditions extends { [conditionName: string]: Condition },
  Properties extends AtomicProperties
> = {
  properties: Properties;
  conditions: Conditions;
  defaultCondition: keyof Conditions | false;
  responsiveArray?: ResponsiveArrayConfig<keyof Conditions>;
};

type Values<Property, Result> = {
  [Value in Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result;
};

type UnconditionalAtomicStyles<Properties extends AtomicProperties> = {
  [Property in keyof Properties]: {
    values: Values<Properties[Property], { defaultClass: string }>;
  };
};

type ConditionalAtomicStyles<
  Conditions extends { [conditionName: string]: Condition },
  Properties extends AtomicProperties
> = {
  [Property in keyof Properties]: {
    responsiveArray: Array<keyof Conditions>;
    values: Values<
      Properties[Property],
      {
        defaultClass: string;
        conditions: {
          [Rule in keyof Conditions]: string;
        };
      }
    >;
  };
};

export function createAtomicStyles<
  Conditions extends BaseConditions,
  Properties extends AtomicProperties
>(
  options: ConditionalAtomicOptions<Conditions, Properties>,
): ConditionalAtomicStyles<Conditions, Properties>;
export function createAtomicStyles<Properties extends AtomicProperties>(
  options: UnconditionalAtomicOptions<Properties>,
): UnconditionalAtomicStyles<Properties>;
export function createAtomicStyles(
  options:
    | UnconditionalAtomicOptions<AtomicProperties>
    | ConditionalAtomicOptions<BaseConditions, AtomicProperties>,
): any {
  let styles = {} as any;

  for (const key in options.properties) {
    const property = options.properties[key as keyof typeof options.properties];
    styles[key] = {
      values: {},
    };

    if ('responsiveArray' in options) {
      styles[key].responsiveArray = options.responsiveArray;
    }

    const processValue = (valueName: keyof typeof property, value: string) => {
      if ('conditions' in options) {
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
