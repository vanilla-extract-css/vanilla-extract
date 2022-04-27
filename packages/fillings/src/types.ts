import { CSSProperties } from '@vanilla-extract/css';
import type { CSSVarFunction } from '@vanilla-extract/private';

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

export type BaseConditions = Record<string, Condition>;

type PropertyDefinition = {
  variable: CSSVarFunction;
  className: string;
};

type ConditionalProperty<Conditions extends BaseConditions> = Record<
  keyof Conditions,
  PropertyDefinition
>;

export type Fillings<PropertyName extends string> = {
  properties: readonly PropertyName[];
  definitions: Record<PropertyName, PropertyDefinition>;
};

export type ConditionalFillings<
  Conditions extends BaseConditions,
  PropertyName extends string,
> = {
  properties: readonly PropertyName[];
  definitions: Record<PropertyName, ConditionalProperty<Conditions>>;
  defaultCondition: keyof Conditions;
};

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

export type FillingsProps<Filling> = Filling extends ConditionalFillings<
  infer Conditions,
  infer PropertyName
>
  ? Partial<
      Record<PropertyName, ComputeConditionalProps<Conditions, PropertyName>>
    >
  : Filling extends Fillings<infer PropertyName>
  ? Partial<Record<PropertyName, ComputeProps<PropertyName>>>
  : never;
