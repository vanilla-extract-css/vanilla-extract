import { createVar, CSSProperties } from '@vanilla-extract/css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

// Config

type Condition =
  | {
      '@media': string;
    }
  | {
      '@supports': string;
    }
  | {
      selector: string;
    };

export type CSSVarFunction = ReturnType<typeof createVar>;

export type BaseConditions = Record<string, Condition>;

type PropertyDefinition = {
  variable: CSSVarFunction;
  className: string;
};

type ConditionalProperty<Conditions extends BaseConditions> = Record<
  keyof Conditions,
  PropertyDefinition
>;

export type FillingsConfig<PropertyName extends string> = {
  properties: readonly PropertyName[];
  definitions: Record<PropertyName, PropertyDefinition>;
};

export type ConditionalFillingsConfig<
  Conditions extends BaseConditions,
  PropertyName extends string,
> = {
  properties: readonly PropertyName[];
  definitions: Record<PropertyName, ConditionalProperty<Conditions>>;
  defaultCondition: keyof Conditions;
};

// Props

type ComputeProps<PropertyName extends string> =
  PropertyName extends keyof CSSProperties
    ? CSSProperties[PropertyName]
    : string;

type ComputeConditionalProps<
  Conditions extends BaseConditions,
  PropertyName extends string,
> = PropertyName extends keyof CSSProperties
  ?
      | Partial<Record<keyof Conditions, CSSProperties[PropertyName]>>
      | CSSProperties[PropertyName]
  : Partial<Record<keyof Conditions, string>> | string;

export type ComputeFillingsProps<Config> =
  Config extends ConditionalFillingsConfig<infer Conditions, infer PropertyName>
    ? Partial<
        Record<PropertyName, ComputeConditionalProps<Conditions, PropertyName>>
      >
    : Config extends FillingsConfig<infer PropertyName>
    ? Partial<Record<PropertyName, ComputeProps<PropertyName>>>
    : never;

// Runtime function

type FillingsReturn = {
  className: string;
  assignVars(): ReturnType<typeof assignInlineVars>;
};

export type FillingsFn<Config> = Config extends ConditionalFillingsConfig<
  BaseConditions,
  string
>
  ? (
      props: ComputeFillingsProps<Config>,
    ) => FillingsReturn & { properties: Config['properties'] }
  : Config extends FillingsConfig<string>
  ? (
      props: ComputeFillingsProps<Config>,
    ) => FillingsReturn & { properties: Config['properties'] }
  : never;

export type FillingsProps<Fn extends FillingsFn<any>> = Parameters<Fn>[0];
