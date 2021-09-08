import type { ComplexStyleRule } from '@vanilla-extract/css';

type FrostingStyleRule = ComplexStyleRule | string;

export type EnumVariant = Record<string, FrostingStyleRule>;
export type VariantTypes = EnumVariant;

export type VariantGroups = Record<string, VariantTypes>;
export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: keyof Variants[VariantGroup];
};

export interface PatternResult<Variants extends VariantGroups> {
  defaultClassName: string;
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string };
  };
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants: Array<[VariantSelection<Variants>, string]>;
}

export type CompoundVariant<Variants extends VariantGroups> =
  VariantSelection<Variants> & {
    style: FrostingStyleRule;
  };

export type PatternOptions<Variants extends VariantGroups> = {
  base?: FrostingStyleRule;
  variants?: Variants;
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants?: Array<CompoundVariant<Variants>>;
};

export type RuntimeFn<Variants extends VariantGroups> = (
  options?: VariantSelection<Variants>,
) => string;
