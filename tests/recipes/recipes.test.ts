import { basic } from './recipes.css';

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

  it('should expose variants class names', () => {
    expect([
      basic.base,
      basic.spaceWithDefault.large,
      basic.spaceWithDefault.small,
      basic.spaceWithoutDefault.large,
      basic.spaceWithoutDefault.small,
      basic.color.blue,
      basic.color.red,
      basic.rounded.true,
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
