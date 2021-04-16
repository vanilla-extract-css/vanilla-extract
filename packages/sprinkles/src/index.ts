import { style } from '@vanilla-extract/css';
import type * as CSS from 'csstype';

interface Condition {
  '@media'?: string;
  '@supports'?: string;
}

interface BaseAtomicOptions {
  properties: {
    [Property in keyof CSS.Properties]?:
      | Record<string, CSS.Properties[Property]>
      | Array<CSS.Properties[Property]>;
  };
}

interface AtomicOptions extends BaseAtomicOptions {
  conditions?: never;
}
interface ConditionalAtomicOptions extends BaseAtomicOptions {
  conditions: Record<string, Condition>;
}

type AtomicStyles<Options extends BaseAtomicOptions, Result = string> = {
  [Property in keyof Options['properties']]: {
    [Variant in Options['properties'][Property] extends Array<any>
      ? Options['properties'][Property][number]
      : keyof Options['properties'][Property]]: Result;
  };
};

type ConditionalAtomicStyles<
  Options extends ConditionalAtomicOptions
> = AtomicStyles<
  Options,
  {
    [Rule in keyof Options['conditions']]: string;
  }
>;

export function createAtomicStyles<
  Options extends AtomicOptions | ConditionalAtomicOptions
>(
  options: Options,
): Options extends ConditionalAtomicOptions
  ? ConditionalAtomicStyles<Options>
  : AtomicStyles<Options> {
  let styles = {} as any;

  for (const key in options.properties) {
    const property = options.properties[key as keyof typeof options.properties];
    styles[key] = {};

    const processVariant = (
      variantName: keyof typeof property,
      value: string,
    ) => {
      if (typeof options.conditions === 'object') {
        styles[key][variantName] = {};

        for (const conditionName in options.conditions) {
          const condition =
            options.conditions[
              conditionName as keyof typeof options.conditions
            ];

          if (condition['@media'] && condition['@supports']) {
            styles[key][variantName][conditionName] = style({
              '@supports': {
                [condition['@supports']]: {
                  '@media': {
                    [condition['@media']]: {
                      [key]: value,
                    },
                  },
                },
              },
            });
          } else if (condition['@supports']) {
            styles[key][variantName][conditionName] = style({
              '@supports': {
                [condition['@supports']]: {
                  [key]: value,
                },
              },
            });
          } else if (condition['@media']) {
            styles[key][variantName][conditionName] = style({
              '@media': {
                [condition['@media']]: {
                  [key]: value,
                },
              },
            });
          } else {
            styles[key][variantName][conditionName] = style({
              [key]: value,
            });
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
