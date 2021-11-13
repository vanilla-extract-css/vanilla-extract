import type { ComplexStyleRule } from '@vanilla-extract/css';

type RecipeStyleRule = ComplexStyleRule | string;

export type VariantDefinitions = Record<string, RecipeStyleRule>;

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

export type VariantGroups = Record<string, VariantDefinitions>;
export type VariantSelection<Variants extends VariantGroups> = {
  [VariantGroup in keyof Variants]?: BooleanMap<keyof Variants[VariantGroup]>;
};

export type PatternResult<
  Variants extends VariantGroups,
  RequiredVariants extends Array<keyof Variants>,
> = {
  defaultClassName: string;
  variantClassNames: {
    [P in keyof Variants]: { [P in keyof Variants[keyof Variants]]: string };
  };
  defaultVariants: VariantSelection<Variants>;
  compoundVariants: Array<[VariantSelection<Variants>, string]>;
  requiredVariants?: RequiredVariants;
};

export interface CompoundVariant<Variants extends VariantGroups> {
  variants: VariantSelection<Variants>;
  style: RecipeStyleRule;
}

export type PatternOptions<
  Variants extends VariantGroups,
  RequiredVariants extends Array<keyof Variants>,
> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  defaultVariants?: VariantSelection<Variants>;
  compoundVariants?: Array<CompoundVariant<Variants>>;
  requiredVariants?: RequiredVariants;
};

export type RuntimeFn<
  Variants extends VariantGroups,
  RequiredVariants extends Array<keyof Variants>,
> = (RequiredVariants extends { length: 0 }
  ? (options?: VariantSelection<Variants>) => string
  : (
      options: Omit<VariantSelection<Variants>, RequiredVariants[number]> &
        Required<Pick<VariantSelection<Variants>, RequiredVariants[number]>>,
    ) => string) & {
  __recipeFn: true;
};

export type RecipeVariants<
  RecipeFn extends ((...args: any) => any) & { __recipeFn: true },
> = Parameters<RecipeFn>[0];
