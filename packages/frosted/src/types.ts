import type { StyleRule } from '@vanilla-extract/css';

type ComposableStyleRule = StyleRule & {
  composes?: Array<string>;
};

export type EnumVariant = Record<string, ComposableStyleRule>;
export type VariantTypes = EnumVariant;

export type VariantGroups = Record<string, VariantTypes>;
export type VariantSelection<Variants extends VariantGroups> = {
  [variantGroup in keyof Variants]?: keyof Variants[variantGroup];
};

export interface PatternResult<Variants extends VariantGroups> {
  defaultClassName: string;
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string };
  };
  defaultVariants?: VariantSelection<Variants>;
}

export type CompoundVariant<Variants extends VariantGroups> =
  VariantSelection<Variants> & {
    css: StyleRule;
  };

export type PatternOptions<Variants extends VariantGroups> =
  ComposableStyleRule & {
    variants?: Variants;
    defaultVariants?: VariantSelection<Variants>;
  };

export type RuntimeFn<Variants extends VariantGroups> = (
  options?: VariantSelection<Variants>,
) => string;
