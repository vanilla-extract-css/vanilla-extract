/*
    This file is for validating types, it is not designed to be executed
*/
import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

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

  noop(invalidVariantValue);
  noop(invalidVariantName);
  noop(validTextVariant);
  noop(recipeShouldReturnString);

  const requiredRecipe = recipe({
    variants: {
      required: {
        a: { fontSize: '12px' },
        b: { fontSize: '16px' },
        c: { fontSize: '24px' },
      },
      optional: {
        a: { color: 'red' },
        b: { color: 'green' },
        c: { color: 'blue' },
      },
    },

    requiredVariants: ['required'],
  });

  // @ts-expect-error An argument for 'options' was not provided.
  requiredRecipe();

  // @ts-expect-error Property 'required' is missing in type '{}'
  requiredRecipe({});

  // @ts-expect-error Property 'required' is missing in type '{ optional: "a"; }'
  requiredRecipe({ optional: 'a' });

  requiredRecipe({ required: 'a' });
  requiredRecipe({ required: 'b', optional: 'c' });

  type RequiredVariants = RecipeVariants<typeof requiredRecipe>;

  const checkRequiredVariantsType = (variants: RequiredVariants) => variants;

  // @ts-expect-error Type 'undefined' is not assignable to type ...
  checkRequiredVariantsType(undefined);

  // @ts-expect-error Property 'required' is missing in type '{}'
  checkRequiredVariantsType({});

  // @ts-expect-error Property 'required' is missing in type '{ optional: "a"; }'
  checkRequiredVariantsType({ optional: 'a' });

  checkRequiredVariantsType({ required: 'a' });
  checkRequiredVariantsType({ required: 'b', optional: 'c' });
};
