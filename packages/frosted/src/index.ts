import { addRecipe } from '@vanilla-extract/css/recipe';
import { style, styleVariants } from '@vanilla-extract/css';

import { createRuntimeFn } from './createRuntimeFn';
import type {
  PatternOptions,
  PatternResult,
  RuntimeFn,
  VariantGroups,
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

export function createPattern<Variants extends VariantGroups>(
  options: PatternOptions<Variants>,
  debugId?: string,
): RuntimeFn<Variants> {
  const { variants = {}, defaultVariants, base = '' } = options;

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

  const config: PatternResult<Variants> = {
    defaultClassName,
    variantClassNames,
    defaultVariants,
  };

  return addRecipe(createRuntimeFn(config), {
    importPath: '@vanilla-extract/frosted/createRuntimeFn',
    importName: 'createRuntimeFn',
    // @ts-expect-error
    args: [config],
  });
}
