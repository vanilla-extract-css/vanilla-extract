import { addRecipe } from '@vanilla-extract/css/recipe';
import { style, styleVariants } from '@vanilla-extract/css';

import { createRuntimeFn } from './createRuntimeFn';
import type {
  PatternOptions,
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

function mapValues<Input extends Record<string, any>, OutputValue>(
  input: Input,
  fn: (value: Input[keyof Input]) => OutputValue,
): Record<keyof Input, OutputValue> {
  const result: any = {};

  for (const key in input) {
    result[key] = fn(input[key]);
  }

  return result;
}

export function recipe<Variants extends VariantGroups>(
  options: PatternOptions<Variants>,
  debugId?: string,
): RuntimeFn<Variants> {
  const {
    variants = {},
    defaultVariants,
    compoundVariants = [],
    base = '',
  } = options;

  const defaultClassName =
    typeof base === 'string' ? base : style(base, debugId);

  // @ts-expect-error
  const variantClassNames: PatternResult<Variants>['variantClassNames'] =
    mapValues(variants, (variantGroup) =>
      styleVariants(
        variantGroup,
        (styleRule) =>
          typeof styleRule === 'string' ? [styleRule] : styleRule,
        debugId,
      ),
    );

  const compounds: Array<[VariantSelection<Variants>, string]> = [];

  for (const { style: theStyle, variants } of compoundVariants) {
    compounds.push([
      variants,
      typeof theStyle === 'string'
        ? theStyle
        : style(theStyle, `${debugId}_compound_${compounds.length}`),
    ]);
  }

  const config: PatternResult<Variants> = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
    compoundVariants: compounds,
  };

  return addRecipe(createRuntimeFn(config), {
    importPath: '@vanilla-extract/recipes/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config],
  });
}
