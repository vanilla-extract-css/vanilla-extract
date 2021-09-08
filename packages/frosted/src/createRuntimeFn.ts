import type {
  PatternResult,
  RuntimeFn,
  VariantGroups,
  VariantSelection,
} from './types';

const shouldApplyCompound = <Variants extends VariantGroups>(
  compoundCheck: VariantSelection<Variants>,
  selections: VariantSelection<Variants>,
) => {
  for (const key of Object.keys(compoundCheck)) {
    if (compoundCheck[key] !== selections[key]) {
      return false;
    }
  }

  return true;
};

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

    for (const [compoundCheck, compoundClassName] of config.compoundVariants) {
      if (shouldApplyCompound(compoundCheck, selections)) {
        className += ` ${compoundClassName}`;
      }
    }

    return className;
  };
