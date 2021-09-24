import type { ComplexStyleRule } from '@vanilla-extract/css';

type RecipeStyleRule = ComplexStyleRule | string;

export type VariantDefinitions = Record<string, RecipeStyleRule>;

type BooleanMap<T> = T extends 'true' ? true : T;

export type VariantGroups = Record<string, VariantDefinitions>;
export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

export type PatternResult<Variants extends VariantGroups> = {
  defaultClassName: string;
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string };
  };
  defaultVariants: VariantSelection<Variants>;
  compoundVariants: Array<[VariantSelection<Variants>, string]>;
};

export interface CompoundVariant<Variants extends VariantGroups> {
  variants: VariantSelection<Variants>;
  style: RecipeStyleRule;
}

export type PatternOptions<Variants extends VariantGroups> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants?: Array<CompoundVariant<Variants>>;
};

export type RuntimeFn<Variants extends VariantGroups> = (
  options?: VariantSelection<Variants>,
) => string;
