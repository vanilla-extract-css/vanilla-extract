/*
    This file is for validating types, it is not designed to be executed
*/
import { recipe, type RecipeVariants } from '@vanilla-extract/recipes';

// @ts-expect-error Unused args
const noop = (...args: Array<any>) => {};

type AssertIsString<S> = S extends string ? true : never;

() => {
  const textRecipes = recipe({
    variants: {
      size: {
        small: { fontSize: '12px' },
        medium: { fontSize: '16px' },
        large: { fontSize: '24px' },
      },
    },
  });

  type TextVariants = RecipeVariants<typeof textRecipes>;

  const invalidVariantValue: TextVariants = {
    // @ts-expect-error Type '"extraLarge"' is not assignable to type '"small" | "large" | "medium" | undefined'.
    size: 'extraLarge',
  };

  const invalidVariantName: TextVariants = {
    // @ts-expect-error Property 'color' does not exist in type
    color: 'brand',
  };

  const validTextVariant: TextVariants = {
    size: 'large',
  };

  const recipeStyles = textRecipes({ size: 'small' });
  const recipeShouldReturnString: AssertIsString<typeof recipeStyles> = true;

  const variants: ReturnType<typeof textRecipes.variants> = ['size'];
  // @ts-expect-error Type '"foo"' is not assignable to type '"size"'.
  const invalidVariants: ReturnType<typeof textRecipes.variants> = ['foo'];

  noop(invalidVariantValue);
  noop(invalidVariantName);
  noop(validTextVariant);
  noop(variants);
  noop(invalidVariants);
  noop(recipeShouldReturnString);
};
