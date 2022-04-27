import { assignInlineVars } from '@vanilla-extract/dynamic';
import type { CSSVarFunction } from '@vanilla-extract/private';
import type {
  BaseConditions,
  ConditionalFillings,
  Fillings,
  FillingsProps,
} from './types';

type ComputeFillingsOptions<Filling extends Fillings<string>> = {
  fillings: Filling;
  props: FillingsProps<Filling>;
};

type ComputeConditionalFillingsOptions<
  Filling extends ConditionalFillings<BaseConditions, string>,
> = {
  fillings: Filling;
  props: FillingsProps<Filling>;
};

type ComputeFillingsReturn = {
  className: string;
  assignVars(): ReturnType<typeof assignInlineVars>;
};

export function computeFillings<
  Filling extends ConditionalFillings<BaseConditions, string>,
>(options: ComputeConditionalFillingsOptions<Filling>): ComputeFillingsReturn;
export function computeFillings<Filling extends Fillings<string>>(
  options: ComputeFillingsOptions<Filling>,
): ComputeFillingsReturn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function computeFillings(options: any): ComputeFillingsReturn {
  if (options.fillings.defaultCondition) {
    const { fillings, props } = options as ComputeConditionalFillingsOptions<
      ConditionalFillings<BaseConditions, string>
    >;
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

  const { fillings, props } = options as ComputeFillingsOptions<
    Fillings<string>
  >;
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
}
