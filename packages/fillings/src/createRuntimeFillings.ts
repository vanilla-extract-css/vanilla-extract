import { assignInlineVars } from '@vanilla-extract/dynamic';

import type {
  BaseConditions,
  ConditionalFillingsConfig,
  CSSVarFunction,
  FillingsConfig,
  FillingsFn,
  ComputeFillingsProps,
} from './types';

export function createRuntimeFillings<
  Config extends ConditionalFillingsConfig<BaseConditions, string>,
>(config: Config): FillingsFn<Config>;
export function createRuntimeFillings<Config extends FillingsConfig<string>>(
  config: Config,
): FillingsFn<Config>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createRuntimeFillings(config: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (options: any) => {
    if (config.defaultCondition) {
      const fillings = config as ConditionalFillingsConfig<
        BaseConditions,
        string
      >;
      const props = options as ComputeFillingsProps<typeof fillings>;

      const { defaultCondition, definitions, properties } = fillings;

      const usedProps = Object.keys(props).filter((prop) =>
        properties.includes(prop),
      ) as (keyof typeof props)[];

      if (usedProps.length === 0) {
        return {
          className: '',
          assignVars() {
            return {};
          },
        };
      }

      const classNames: string[] = [];
      const setVars: [CSSVarFunction, string][] = [];

      for (const prop of usedProps) {
        if (typeof props[prop] === 'object' && props[prop] !== null) {
          const valuesByCondition = props[prop] as Record<string, string>;

          for (const conditionName in valuesByCondition) {
            classNames.push(definitions[prop][conditionName].className);

            setVars.push([
              definitions[prop][conditionName].variable,
              valuesByCondition[conditionName],
            ]);
          }
        }

        if (typeof props[prop] === 'string') {
          classNames.push(definitions[prop][defaultCondition].className);

          setVars.push([
            definitions[prop][defaultCondition].variable,
            props[prop] as string,
          ]);
        }
      }

      return {
        className: classNames.join(' '),
        assignVars() {
          return assignInlineVars(Object.fromEntries(setVars));
        },
      };
    }

    const fillings = config as FillingsConfig<string>;
    const props = options as ComputeFillingsProps<typeof fillings>;
    const { definitions, properties } = fillings;

    const usedProps = Object.keys(props).filter((prop) =>
      properties.includes(prop),
    ) as (keyof typeof props)[];

    if (usedProps.length === 0) {
      return {
        className: '',
        assignVars() {
          return {};
        },
      };
    }

    const classNames: string[] = [];
    const setVars: [CSSVarFunction, string][] = [];

    for (const prop of usedProps) {
      if (typeof props[prop] === 'string') {
        classNames.push(definitions[prop].className);

        setVars.push([definitions[prop].variable, props[prop] as string]);
      }
    }

    return {
      className: classNames.join(' '),
      assignVars() {
        return assignInlineVars(Object.fromEntries(setVars));
      },
    };
  };
}
