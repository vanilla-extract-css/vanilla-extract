import type {
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

export const createRuntimeFn =
  <Variants extends VariantGroups>(
    config: PatternResult<Variants>,
  ): RuntimeFn<Variants> =>
  (options) => {
    let className = config.defaultClassName;

    // @ts-expect-error
    const selections: VariantSelection<Variants> = {
      ...config.defaultVariants,
      ...options,
    };
    for (const variantName in selections) {
      const variantSelection = selections[variantName];

      if (variantSelection) {
        // @ts-expect-error
        className += ` ${config.variantClassNames[variantName][variantSelection]}`;
      }
    }

    return className;
  };
