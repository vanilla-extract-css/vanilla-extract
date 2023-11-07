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
import { mapValues } from './utils';

export type { RecipeVariants, RuntimeFn } from './types';

export function recipe<Variants extends VariantGroups>(
  options: PatternOptions<Variants>,
  debugId?: string,
): RuntimeFn<Variants> {
  const {
    variants = {},
    defaultVariants = {},
    compoundVariants = [],
    base,
  } = options;

  let defaultClassName;

  if (!base || typeof base === 'string') {
    const baseClassName = style({});
    defaultClassName = base ? `${baseClassName} ${base}` : baseClassName;
  } else {
    defaultClassName = style(base, debugId);
  }

  // @ts-expect-error
  const variantClassNames: PatternResult<Variants>['variantClassNames'] =
    mapValues(variants, (variantGroup, variantGroupName) =>
      styleVariants(
        variantGroup,
        (styleRule) =>
          typeof styleRule === 'string' ? [styleRule] : styleRule,
        debugId ? `${debugId}_${variantGroupName}` : variantGroupName,
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
