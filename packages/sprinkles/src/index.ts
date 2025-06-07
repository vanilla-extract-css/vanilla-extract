import {
  style,
  composeStyles,
  type CSSProperties,
  type StyleRule,
} from '@vanilla-extract/css';
import { addRecipe } from '@vanilla-extract/css/recipe';
import { hasFileScope } from '@vanilla-extract/css/fileScope';

import {
  type SprinklesFn,
  createSprinkles as internalCreateSprinkles,
} from './createSprinkles';
import type { SprinklesProperties, ResponsiveArrayConfig } from './types';

export { createNormalizeValueFn, createMapValueFn } from './createUtils';
export type { ConditionalValue, RequiredConditionalValue } from './createUtils';

export type { ResponsiveArray, SprinklesProperties } from './types';

type ConditionKey = '@media' | '@supports' | '@container' | 'selector';
type Condition = Partial<Record<ConditionKey, string>>;

type BaseConditions = { [conditionName: string]: Condition };

type AtomicCSSProperties = {
  [Property in keyof CSSProperties]?:
    | Record<string, CSSProperties[Property] | Omit<StyleRule, ConditionKey>>
    | ReadonlyArray<CSSProperties[Property]>;
};

type AtomicCustomProperties = Record<
  string,
  Record<string | number, Omit<StyleRule, ConditionKey>>
>;

type AtomicProperties = AtomicCSSProperties | AtomicCustomProperties;

type ShorthandOptions<
  Properties extends AtomicProperties,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> },
> = {
  shorthands: Shorthands;
};

type UnconditionalAtomicOptions<Properties extends AtomicProperties> = {
  '@layer'?: string;
  properties: Properties;
};

type ResponsiveArrayOptions<
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number,
> = {
  responsiveArray: ResponsiveArrayConfig<keyof Conditions> & {
    length: ResponsiveLength;
  };
};

type ConditionalAtomicOptions<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = UnconditionalAtomicOptions<Properties> & {
  conditions: Conditions;
  defaultCondition: DefaultCondition;
};

type Values<Property, Result> = {
  [Value in Property extends ReadonlyArray<any>
    ? Property[number]
    : Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result;
};

type UnconditionalAtomicStyles<Properties extends AtomicProperties> = {
  conditions: never;
  styles: {
    [Property in keyof Properties]: {
      values: Values<Properties[Property], { defaultClass: string }>;
    };
  };
};

type ConditionalAtomicStyles<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = {
  conditions: {
    defaultCondition: DefaultCondition;
    conditionNames: Array<keyof Conditions>;
  };
  styles: {
    [Property in keyof Properties]: {
      values: Values<
        Properties[Property],
        {
          defaultClass: DefaultCondition extends false ? undefined : string;
          conditions: {
            [Rule in keyof Conditions]: string;
          };
        }
      >;
    };
  };
};

type ConditionalWithResponsiveArrayAtomicStyles<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
> = {
  conditions: {
    defaultCondition: DefaultCondition;
    conditionNames: Array<keyof Conditions>;
    responsiveArray: Array<keyof Conditions> & { length: ResponsiveLength };
  };
  styles: {
    [Property in keyof Properties]: {
      responsiveArray: Array<keyof Conditions> & { length: ResponsiveLength };
      values: Values<
        Properties[Property],
        {
          defaultClass: DefaultCondition extends false ? undefined : string;
          conditions: {
            [Rule in keyof Conditions]: string;
          };
        }
      >;
    };
  };
};

type ShorthandAtomicStyles<
  Shorthands extends {
    [shorthandName: string]: Array<string | number | symbol>;
  },
> = {
  styles: {
    [Shorthand in keyof Shorthands]: {
      mappings: Shorthands[Shorthand];
    };
  };
};

// Conditional + Shorthands + ResponsiveArray
export function defineProperties<
  Properties extends AtomicProperties,
  ResponsiveLength extends number,
  Conditions extends BaseConditions,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> },
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: ConditionalAtomicOptions<Properties, Conditions, DefaultCondition> &
    ShorthandOptions<Properties, Shorthands> &
    ResponsiveArrayOptions<Conditions, ResponsiveLength>,
): ConditionalWithResponsiveArrayAtomicStyles<
  Properties,
  Conditions,
  ResponsiveLength,
  DefaultCondition
> &
  ShorthandAtomicStyles<Shorthands>;
// Conditional + Shorthands
export function defineProperties<
  Properties extends AtomicProperties,
  Conditions extends BaseConditions,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> },
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: ConditionalAtomicOptions<Properties, Conditions, DefaultCondition> &
    ShorthandOptions<Properties, Shorthands>,
): ConditionalAtomicStyles<Properties, Conditions, DefaultCondition> &
  ShorthandAtomicStyles<Shorthands>;
// Conditional + ResponsiveArray
export function defineProperties<
  Properties extends AtomicProperties,
  Conditions extends BaseConditions,
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: ConditionalAtomicOptions<Properties, Conditions, DefaultCondition> &
    ResponsiveArrayOptions<Conditions, ResponsiveLength>,
): ConditionalWithResponsiveArrayAtomicStyles<
  Properties,
  Conditions,
  ResponsiveLength,
  DefaultCondition
>;
// Conditional
export function defineProperties<
  Properties extends AtomicProperties,
  Conditions extends BaseConditions,
  DefaultCondition extends keyof Conditions | Array<keyof Conditions> | false,
>(
  options: ConditionalAtomicOptions<Properties, Conditions, DefaultCondition>,
): ConditionalAtomicStyles<Properties, Conditions, DefaultCondition>;
// Unconditional + Shorthands
export function defineProperties<
  Properties extends AtomicProperties,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> },
>(
  options: UnconditionalAtomicOptions<Properties> &
    ShorthandOptions<Properties, Shorthands>,
): UnconditionalAtomicStyles<Properties> & ShorthandAtomicStyles<Shorthands>;
// Unconditional
export function defineProperties<Properties extends AtomicProperties>(
  options: UnconditionalAtomicOptions<Properties>,
): UnconditionalAtomicStyles<Properties>;
export function defineProperties(options: any): any {
  let styles: any =
    'shorthands' in options
      ? Object.fromEntries(
          Object.entries(options.shorthands).map(([prop, mappings]) => [
            prop,
            { mappings },
          ]),
        )
      : {};

  for (const key in options.properties) {
    const property = options.properties[key as keyof typeof options.properties];
    styles[key] = {
      values: {},
    };

    if ('responsiveArray' in options) {
      styles[key].responsiveArray = options.responsiveArray;
    }

    const processValue = (
      valueName: keyof typeof property,
      value: string | number | StyleRule,
    ) => {
      if ('conditions' in options) {
        styles[key].values[valueName] = {
          conditions: {},
        };

        const defaultConditions = options.defaultCondition
          ? Array.isArray(options.defaultCondition)
            ? options.defaultCondition
            : [options.defaultCondition]
          : [];

        const defaultClasses = [];

        for (const conditionName in options.conditions) {
          let styleValue: StyleRule =
            typeof value === 'object' ? value : { [key]: value };

          const condition =
            options.conditions[
              conditionName as keyof typeof options.conditions
            ];

          if (condition['@supports']) {
            styleValue = {
              '@supports': {
                [condition['@supports']]: styleValue,
              },
            };
          }

          if (condition['@container']) {
            styleValue = {
              '@container': {
                [condition['@container']]: styleValue,
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

          if (options['@layer']) {
            styleValue = {
              '@layer': {
                [options['@layer']]: styleValue,
              },
            };
          }

          const className = style(
            styleValue,
            `${key}_${String(valueName)}_${conditionName}`,
          );

          styles[key].values[valueName].conditions[conditionName] = className;

          if (defaultConditions.indexOf(conditionName) > -1) {
            defaultClasses.push(className);
          }
        }

        if (defaultClasses.length > 0) {
          styles[key].values[valueName].defaultClass = defaultClasses.join(' ');
        }
      } else {
        let styleValue: StyleRule =
          typeof value === 'object' ? value : { [key]: value };

        if (options['@layer']) {
          styleValue = {
            '@layer': {
              [options['@layer']]: styleValue,
            },
          };
        }

        styles[key].values[valueName] = {
          defaultClass: style(styleValue, `${key}_${String(valueName)}`),
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

  const conditions =
    'conditions' in options
      ? {
          defaultCondition: options.defaultCondition,
          conditionNames: Object.keys(options.conditions),
          responsiveArray: options.responsiveArray,
        }
      : undefined;

  return { conditions, styles };
}

const mockComposeStyles = (classList: string) => classList;

export function createSprinkles<
  Args extends ReadonlyArray<SprinklesProperties>,
>(...config: Args): SprinklesFn<Args> {
  // When using Sprinkles with the runtime (e.g. within a jest test)
  // `style` can be called (only for composition) outside of a fileScope.
  // Checking we're within a fileScope ensures this doesn't blow up and is
  // safe as compositions don't make sense at runtime
  const sprinkles = internalCreateSprinkles(
    hasFileScope() ? composeStyles : mockComposeStyles,
  )(...config);

  return addRecipe(sprinkles, {
    importPath: '@vanilla-extract/sprinkles/createRuntimeSprinkles',
    importName: 'createSprinkles',
    args: config,
  });
}

/** @deprecated - Use `defineProperties` */
export const createAtomicStyles = defineProperties;

/** @deprecated - Use `createSprinkles` */
export const createAtomsFn = createSprinkles;
