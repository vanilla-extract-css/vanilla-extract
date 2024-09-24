import type { ComplexStyleRule } from '@vanilla-extract/css';

type Resolve<T> = {
  [Key in keyof T]: T[Key];
} & {};

type RecipeStyleRule = ComplexStyleRule | string;

export type VariantDefinitions = Record<string, RecipeStyleRule>;

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

export type VariantGroups = Record<string, VariantDefinitions>;
export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

export type VariantsClassNames<Variants extends VariantGroups> = {
  [P in keyof Variants]: {
    [PP in keyof Variants[P]]: string;
  };
};

export type PatternResult<Variants extends VariantGroups> = {
  defaultClassName: string;
  variantClassNames: VariantsClassNames<Variants>;
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

export type RecipeClassNames<Variants extends VariantGroups> = {
  base: string;
  variants: VariantsClassNames<Variants>;
};

export type RuntimeFn<Variants extends VariantGroups> = ((
  options?: Resolve<VariantSelection<Variants>>,
) => string) & {
  variants: () => (keyof Variants)[];
  classNames: RecipeClassNames<Variants>;
};

export type RecipeVariants<RecipeFn extends RuntimeFn<VariantGroups>> = Resolve<
  Parameters<RecipeFn>[0]
>;
