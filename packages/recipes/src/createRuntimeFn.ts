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

export const createRuntimeFn = <
  Variants extends VariantGroups,
  RequiredVariants extends Array<keyof Variants>,
>(
  config: PatternResult<Variants, RequiredVariants>,
): RuntimeFn<Variants, RequiredVariants> => {
  const requiredVariants =
    config.requiredVariants && config.requiredVariants.length > 0
      ? config.requiredVariants
      : null;

  return Object.assign(
    (options: VariantSelection<Variants> | undefined) => {
      if (process.env.NODE_ENV !== 'production') {
        if (requiredVariants) {
          let missingVariants: Array<keyof Variants> = !options
            ? requiredVariants
            : [];

          if (options) {
            for (const requiredVariant of requiredVariants) {
              if (!options[requiredVariant]) {
                missingVariants.push(requiredVariant);
              }
            }
          }

          if (missingVariants.length > 0) {
            throw new Error(
              `Required variants not provided: ${missingVariants
                .map((x) => `"${x}"`)
                .join(', ')}`,
            );
          }
        }
      }

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

          // @ts-expect-error
          className += ' ' + config.variantClassNames[variantName][selection];
        }
      }

      for (const [
        compoundCheck,
        compoundClassName,
      ] of config.compoundVariants) {
        if (shouldApplyCompound(compoundCheck, selections)) {
          className += ' ' + compoundClassName;
        }
      }

      return className;
    },
    { __recipeFn: true } as const,
  );
};
