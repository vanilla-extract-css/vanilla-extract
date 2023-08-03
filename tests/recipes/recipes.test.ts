import {
  basic,
  empty,
  definedStringBase,
  definedStringBaseArray,
} from './recipes.css';

describe('recipes', () => {
  it('should return default variants for no options', () => {
    expect(basic()).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1"`,
    );
  });

  it('should return default variants for empty options', () => {
    expect(basic({})).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1"`,
    );
  });

  it('should return default variants for undefined options', () => {
    expect(basic({ spaceWithDefault: undefined })).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1"`,
    );
  });

  it('should return requested variants', () => {
    expect(
      basic({
        spaceWithDefault: 'large',
        spaceWithoutDefault: 'small',
        color: 'blue',
      }),
    ).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_large__niwegb2 recipes_basic_spaceWithoutDefault_small__niwegb3 recipes_basic_color_blue__niwegb6"`,
    );
  });

  it('should return requested compound variants', () => {
    expect(
      basic({ spaceWithDefault: 'small', color: 'red' }),
    ).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1 recipes_basic_color_red__niwegb5 recipes_basic_compound_0__niwegb8"`,
    );
  });

  it('should return compound variants via defaultVariants', () => {
    expect(basic({ color: 'red' })).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1 recipes_basic_color_red__niwegb5 recipes_basic_compound_0__niwegb8"`,
    );
  });

  it('should return compound variants via defaultVariants, even when undefined is passed', () => {
    expect(
      basic({ color: 'red', spaceWithDefault: undefined }),
    ).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1 recipes_basic_color_red__niwegb5 recipes_basic_compound_0__niwegb8"`,
    );
  });

  it('should return boolean variants', () => {
    expect(basic({ rounded: true })).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1 recipes_basic_rounded_true__niwegb7"`,
    );
  });

  it('should ignore missing boolean variants', () => {
    expect(basic({ rounded: false })).toMatchInlineSnapshot(
      `"recipes_basic__niwegb0 recipes_basic_spaceWithDefault_small__niwegb1"`,
    );
  });

  it('should expose a function returning list of variants', () => {
    expect(basic.variants()).toMatchInlineSnapshot(`
      [
        "spaceWithDefault",
        "spaceWithoutDefault",
        "color",
        "rounded",
      ]
    `);
  });

  it('should have base class name even when "base" prop is not defined', () => {
    expect(empty()).toMatchInlineSnapshot(`"recipes__niwegb9"`);
    expect(empty.classNames.base).toMatchInlineSnapshot(`"recipes__niwegb9"`);
    expect(empty()).toStrictEqual(empty.classNames.base);
  });

  it('should include generated base class name for provided string classes', () => {
    expect(definedStringBase()).toMatchInlineSnapshot(
      `"recipes__niwegba definedStringBase"`,
    );
    expect(definedStringBase.classNames.base).toMatchInlineSnapshot(
      `"recipes__niwegba"`,
    );

    expect(definedStringBase({ variant: 'simple' })).toMatchInlineSnapshot(
      `"recipes__niwegba definedStringBase recipes_definedStringBase_variant_simple__niwegbb simple-one"`,
    );
    expect(
      definedStringBase.classNames.variants.variant.simple,
    ).toMatchInlineSnapshot(
      `"recipes_definedStringBase_variant_simple__niwegbb"`,
    );
  });

  it('should include generated base class name for provided array string classes', () => {
    expect(definedStringBaseArray()).toMatchInlineSnapshot(
      `"recipes_definedStringBaseArray__niwegbc definedStringBaseInArray_1 definedStringBaseInArray_2"`,
    );
    expect(definedStringBaseArray.classNames.base).toMatchInlineSnapshot(
      `"recipes_definedStringBaseArray__niwegbc"`,
    );

    expect(definedStringBaseArray({ variant: 'simple' })).toMatchInlineSnapshot(
      `"recipes_definedStringBaseArray__niwegbc definedStringBaseInArray_1 definedStringBaseInArray_2 recipes_definedStringBaseArray_variant_simple__niwegbd simple-one simple-two"`,
    );
    expect(
      definedStringBaseArray.classNames.variants.variant.simple,
    ).toMatchInlineSnapshot(
      `"recipes_definedStringBaseArray_variant_simple__niwegbd"`,
    );
  });

  it('should expose variants class names', () => {
    expect([
      basic.classNames.base,
      basic.classNames.variants.spaceWithDefault.large,
      basic.classNames.variants.spaceWithDefault.small,
      basic.classNames.variants.spaceWithoutDefault.large,
      basic.classNames.variants.spaceWithoutDefault.small,
      basic.classNames.variants.color.blue,
      basic.classNames.variants.color.red,
      basic.classNames.variants.rounded.true,
    ]).toMatchInlineSnapshot(`
      [
        "recipes_basic__niwegb0",
        "recipes_basic_spaceWithDefault_large__niwegb2",
        "recipes_basic_spaceWithDefault_small__niwegb1",
        "recipes_basic_spaceWithoutDefault_large__niwegb4",
        "recipes_basic_spaceWithoutDefault_small__niwegb3",
        "recipes_basic_color_blue__niwegb6",
        "recipes_basic_color_red__niwegb5",
        "recipes_basic_rounded_true__niwegb7",
      ]
    `);
  });
});
