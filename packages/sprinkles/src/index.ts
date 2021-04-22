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

type ShorthandOptions<
  Properties extends AtomicProperties,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> }
> = {
  shorthands: Shorthands;
};

type UnconditionalAtomicOptions<Properties extends AtomicProperties> = {
  properties: Properties;
};

type ConditionalAtomicOptions<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number
> = UnconditionalAtomicOptions<Properties> & {
  conditions: Conditions;
  defaultCondition: keyof Conditions | false;
  responsiveArray?: ResponsiveArrayConfig<keyof Conditions> & {
    length: ResponsiveLength;
  };
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
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number
> = {
  [Property in keyof Properties]: {
    responsiveArray: Array<keyof Conditions> & { length: ResponsiveLength };
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

type ShorthandMappings<
  Shorthands extends {
    [shorthandName: string]: Array<string | number | symbol>;
  }
> = {
  [Shorthand in keyof Shorthands]: {
    mappings: Shorthands[Shorthand];
  };
};

// Conditional + Shorthands
export function createAtomicStyles<
  Properties extends AtomicProperties,
  ResponsiveLength extends number,
  Conditions extends BaseConditions,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> }
>(
  options: ConditionalAtomicOptions<Properties, Conditions, ResponsiveLength> &
    ShorthandOptions<Properties, Shorthands>,
): ConditionalAtomicStyles<Properties, Conditions, ResponsiveLength> &
  ShorthandMappings<Shorthands>;
// Conditional
export function createAtomicStyles<
  Properties extends AtomicProperties,
  Conditions extends BaseConditions,
  ResponsiveLength extends number
>(
  options: ConditionalAtomicOptions<Properties, Conditions, ResponsiveLength>,
): ConditionalAtomicStyles<Properties, Conditions, ResponsiveLength>;
// Unconditional + Shorthands
export function createAtomicStyles<
  Properties extends AtomicProperties,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> }
>(
  options: UnconditionalAtomicOptions<Properties> &
    ShorthandOptions<Properties, Shorthands>,
): UnconditionalAtomicStyles<Properties> & ShorthandMappings<Shorthands>;
// Unconditional
export function createAtomicStyles<Properties extends AtomicProperties>(
  options: UnconditionalAtomicOptions<Properties>,
): UnconditionalAtomicStyles<Properties>;
export function createAtomicStyles(options: any): any {
  let styles: any = Object.fromEntries(
    Object.entries(options.shorthands).map(([prop, mappings]) => [
      prop,
      { mappings },
    ]),
  );

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
        processValue(value, value);
      }
    } else {
      for (const valueName in property) {
        const value = property[valueName];
        processValue(valueName, value);
      }
    }
  }

  return styles;
}
