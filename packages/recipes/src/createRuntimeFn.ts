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

    const selections: VariantSelection<Variants> = {
      ...config.defaultVariants,
      ...options,
    };
    for (const variantName in selections) {
      const variantSelection =
        selections[variantName] ?? config.defaultVariants[variantName];

      if (variantSelection != null) {
        let selection = variantSelection;

        if (typeof selection === 'boolean') {
          // @ts-expect-error
          selection = selection === true ? 'true' : 'false';
        }

        className += ' '.concat(
          // @ts-expect-error
          config.variantClassNames[variantName][selection],
        );
      }
    }

    for (const [compoundCheck, compoundClassName] of config.compoundVariants) {
      if (shouldApplyCompound(compoundCheck, selections)) {
        className += ' '.concat(compoundClassName);
      }
    }

    return className;
  };
