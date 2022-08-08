import {
  createMapValueFn,
  createNormalizeValueFn,
  createSprinkles,
} from '@vanilla-extract/sprinkles';

import { expect, describe, it } from 'vitest';

import {
  basicProperties,
  propertiesWithPaddingShorthands,
  propertiesWithShorthands,
  conditionalProperties,
  conditionalPropertiesWithMultipleDefaultConditions,
  conditionalPropertiesWithoutDefaultCondition,
  conditionalPropertiesWithoutResponsiveArray,
  shorthandsWithZeroValues,
} from './index.css';

describe('sprinkles', () => {
  describe('createSprinkles', () => {
    it('should handle unconditional properties', () => {
      const sprinkles = createSprinkles(basicProperties);

      expect(sprinkles({ top: 0, color: 'green-300' })).toMatchInlineSnapshot(
        `"sprinkles_top_0__1kw4bre3 sprinkles_color_green-300__1kw4bre2"`,
      );
    });

    it('should handle default classes on conditional properties', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(sprinkles({ display: 'block' })).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej"`,
      );
    });

    it('should ignore undefined property values', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({
          display: 'block',
          paddingTop: undefined,
        }),
      ).toMatchInlineSnapshot(`"sprinkles_display_block_mobile__1kw4brej"`);
    });

    it('should handle falsey values on conditional properties', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({ display: 'block', opacity: { mobile: 0, desktop: 1 } }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_opacity_0_mobile__1kw4bre1a sprinkles_opacity_1_desktop__1kw4bre1f"`,
      );
    });

    it('should handle falsey values from responsive array on conditional properties', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({ display: 'block', opacity: [0, 1] }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_opacity_0_mobile__1kw4bre1a sprinkles_opacity_1_tablet__1kw4bre1e"`,
      );
    });

    it('should handle conditional properties with different variants', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_display_flex_desktop__1kw4brer"`,
      );
    });

    it('should handle a mix of unconditional and conditional properties', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
          color: 'gray-500',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_display_flex_desktop__1kw4brer sprinkles_color_gray-500__1kw4brea"`,
      );
    });

    it('should ignore undefined conditional values', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          paddingTop: {
            mobile: 'medium',
            tablet: undefined,
            desktop: 'large',
          },
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_medium_mobile__1kw4brev sprinkles_paddingTop_large_desktop__1kw4bre10"`,
      );
    });

    it('should handle responsive arrays', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          display: ['block', 'flex', 'block'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_display_flex_tablet__1kw4breq sprinkles_display_block_desktop__1kw4brel"`,
      );
    });

    it('should handle responsive arrays with null values', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          display: ['block', null, 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_display_flex_desktop__1kw4brer"`,
      );
    });

    it('should handle responsive arrays that end early', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({
          display: ['block', 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brej sprinkles_display_flex_tablet__1kw4breq"`,
      );
    });

    it('should handle shorthand properties with a default condition', () => {
      const sprinkles = createSprinkles(propertiesWithShorthands);

      expect(
        sprinkles({
          paddingX: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_large__1kw4bref sprinkles_paddingRight_large__1kw4brei"`,
      );
    });

    it('should handle shorthand properties with a conditional value', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({
          paddingY: {
            mobile: 'medium',
            tablet: 'large',
          },
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingBottom_medium_mobile__1kw4bre14 sprinkles_paddingBottom_large_tablet__1kw4bre18 sprinkles_paddingTop_medium_mobile__1kw4brev sprinkles_paddingTop_large_tablet__1kw4brez"`,
      );
    });

    it('should handle shorthand properties with a responsive array', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(
        sprinkles({
          paddingY: ['small', 'medium', 'large'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingBottom_small_mobile__1kw4bre11 sprinkles_paddingBottom_medium_tablet__1kw4bre15 sprinkles_paddingBottom_large_desktop__1kw4bre19 sprinkles_paddingTop_small_mobile__1kw4bres sprinkles_paddingTop_medium_tablet__1kw4brew sprinkles_paddingTop_large_desktop__1kw4bre10"`,
      );
    });

    it('should merge shorthand styles with non-shorthands', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          paddingX: 'small',
          paddingY: {
            mobile: 'medium',
            desktop: 'large',
          },
          paddingTop: 'small',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_small__1kw4bred sprinkles_paddingRight_small__1kw4breg sprinkles_paddingBottom_medium_mobile__1kw4bre14 sprinkles_paddingBottom_large_desktop__1kw4bre19 sprinkles_paddingTop_small_mobile__1kw4bres"`,
      );
    });

    it('should ignore undefined longhand values when resolving shorthands', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          paddingY: 'small',
          paddingTop: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingBottom_small_mobile__1kw4bre11 sprinkles_paddingTop_small_mobile__1kw4bres"`,
      );
    });

    it('should ignore undefined shorthand values when resolving shorthands', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(
        sprinkles({
          paddingX: 'small',
          anotherPaddingX: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_small__1kw4bred sprinkles_paddingRight_small__1kw4breg"`,
      );
    });

    it('should preserve config order of shorthands', () => {
      const sprinkles = createSprinkles(propertiesWithPaddingShorthands);

      expect(
        sprinkles({
          paddingTop: 'small',
          paddingX: 'small',
          paddingY: 'medium',
          padding: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_small__1kw4bre23 sprinkles_paddingBottom_medium__1kw4bre27 sprinkles_paddingLeft_small__1kw4bre1x sprinkles_paddingRight_small__1kw4bre20"`,
      );
    });

    it('should handle shorthands with zero values', () => {
      const sprinkles = createSprinkles(shorthandsWithZeroValues);

      expect(
        sprinkles({
          mt: 0,
        }),
      ).toMatchInlineSnapshot(`"sprinkles_marginTop_0__1kw4bre2a"`);
    });

    it('should preserve config order of shorthands', () => {
      const sprinkles = createSprinkles(propertiesWithPaddingShorthands);

      expect(
        sprinkles({
          paddingX: 'small',
          padding: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_large__1kw4bre25 sprinkles_paddingBottom_large__1kw4bre28 sprinkles_paddingLeft_small__1kw4bre1x sprinkles_paddingRight_small__1kw4bre20"`,
      );
    });

    it('should provide a static set of properties on the sprinkles function', () => {
      const sprinkles = createSprinkles(
        propertiesWithShorthands,
        conditionalProperties,
      );

      expect(sprinkles.properties).toMatchInlineSnapshot(`
        Set {
          "paddingX",
          "anotherPaddingX",
          "color",
          "paddingLeft",
          "paddingRight",
          "paddingY",
          "display",
          "paddingTop",
          "paddingBottom",
          "opacity",
        }
      `);
    });
  });

  describe('errors', () => {
    it('should handle invalid properties', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          paddingLefty: 'small',
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingLefty\\" is not a valid sprinkle"`,
      );
    });

    it('should handle invalid property values', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          paddingLeft: 'xsmall',
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingLeft\\" is not a valid sprinkle"`,
      );
    });

    it('should handle conditional objects to unconditional values', () => {
      const sprinkles = createSprinkles(basicProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          color: {
            mobile: 'red',
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"color\\" is not a conditional property"`,
      );
    });

    it('should handle missing responsive arrays definitions', () => {
      const sprinkles = createSprinkles(
        conditionalPropertiesWithoutResponsiveArray,
      );

      expect(() =>
        sprinkles({
          // @ts-expect-error
          marginTop: ['small'],
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"marginTop\\" does not support responsive arrays"`,
      );
    });

    it('should handle invalid responsive arrays values', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          paddingTop: ['xsmall'],
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingTop\\" has no value \\"xsmall\\". Possible values are \\"small\\", \\"medium\\", \\"large\\""`,
      );
    });

    it('should handle responsive arrays with too many values', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          paddingTop: ['small', 'medium', 'large', 'small'],
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingTop\\" only supports up to 3 breakpoints. You passed 4"`,
      );
    });

    it('should handle invalid conditional property values', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          // @ts-expect-error
          paddingTop: {
            mobile: 'xlarge',
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingTop\\" has no value \\"xlarge\\". Possible values are \\"small\\", \\"medium\\", \\"large\\""`,
      );
    });

    it('should handle properties with no default condition', () => {
      const sprinkles = createSprinkles(
        conditionalPropertiesWithoutDefaultCondition,
      );

      expect(() =>
        sprinkles({
          // @ts-expect-error
          transform: 'shrink',
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"transform\\" has no default condition. You must specify which conditions to target explicitly. Possible options are \\"active\\""`,
      );
    });

    it('should handle invalid conditions', () => {
      const sprinkles = createSprinkles(conditionalProperties);

      expect(() =>
        sprinkles({
          paddingTop: {
            // @ts-expect-error
            ultraWide: 'large',
          },
        }),
      ).toThrowErrorMatchingInlineSnapshot(
        `"\\"paddingTop\\" has no condition named \\"ultraWide\\". Possible values are \\"mobile\\", \\"tablet\\", \\"desktop\\""`,
      );
    });
  });

  describe('createNormalizeValueFn', () => {
    it('should handle unresponsive values', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue('foobar')).toMatchInlineSnapshot(`
        Object {
          "mobile": "foobar",
        }
      `);
    });

    it('should handle unresponsive booleans', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue(false)).toMatchInlineSnapshot(`
        Object {
          "mobile": false,
        }
      `);
    });

    it('should handle responsive arrays', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue([false, true])).toMatchInlineSnapshot(`
        Object {
          "mobile": false,
          "tablet": true,
        }
      `);
    });

    it('should handle responsive arrays', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue(['one', 'two', 'three'])).toMatchInlineSnapshot(`
        Object {
          "desktop": "three",
          "mobile": "one",
          "tablet": "two",
        }
      `);
    });

    it('should handle responsive arrays with nulls', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue(['mobile', null, true])).toMatchInlineSnapshot(`
        Object {
          "desktop": true,
          "mobile": "mobile",
        }
      `);
    });

    it('should handle conditional objects', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(normalizeValue({ mobile: 'one', desktop: 'three' }))
        .toMatchInlineSnapshot(`
        Object {
          "desktop": "three",
          "mobile": "one",
        }
      `);
    });

    it('should handle conditional objects with undefined', () => {
      const normalizeValue = createNormalizeValueFn(conditionalProperties);

      expect(
        normalizeValue({ mobile: 'one', tablet: undefined, desktop: 'three' }),
      ).toMatchInlineSnapshot(`
        Object {
          "desktop": "three",
          "mobile": "one",
          "tablet": undefined,
        }
      `);
    });
  });

  describe('createMapValueFn', () => {
    it('should handle strings', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        'foobar',
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`"foobar_mobile"`);
    });

    it('should handle numbers', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(123, (value, key) => `${value}_${key}` as const);

      expect(value).toMatchInlineSnapshot(`"123_mobile"`);
    });

    it('should handle booleans', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(123, () => false);

      expect(value).toBe(false);
    });

    it('should handle conditional booleans', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        { mobile: 1, tablet: 2, desktop: 3 },
        (value) => value === 2,
      );

      expect(value).toStrictEqual({
        mobile: false,
        tablet: true,
        desktop: false,
      });
    });

    it('should handle nulls', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(123, () => null);

      expect(value).toBe(null);
    });

    it('should handle conditional nulls', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        { mobile: 1, tablet: false, desktop: 3 },
        (value) => value || null,
      );

      expect(value).toStrictEqual({ mobile: 1, tablet: null, desktop: 3 });
    });

    it('should handle undefined', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(true, () => undefined);

      expect(value).toBe(undefined);
    });

    it('should handle conditional undefined', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        { mobile: 1, tablet: false, desktop: 3 },
        (value) => value || undefined,
      );

      expect(value).toStrictEqual({ mobile: 1, tablet: undefined, desktop: 3 });
    });

    it('should handle responsive arrays', () => {
      const map = createMapValueFn(conditionalProperties);
      const value = map(['one'], (value, key) => `${value}_${key}` as const);

      expect(value).toMatchInlineSnapshot(`
        Object {
          "mobile": "one_mobile",
        }
      `);
    });

    it('should handle responsive arrays', () => {
      const map = createMapValueFn(conditionalProperties);
      const value = map(
        ['one', 'two'],
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`
        Object {
          "mobile": "one_mobile",
          "tablet": "two_tablet",
        }
      `);
    });

    it('should handle responsive arrays', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        [false, true, false],
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`
        Object {
          "desktop": "false_desktop",
          "mobile": "false_mobile",
          "tablet": "true_tablet",
        }
      `);
    });

    it('should handle responsive arrays with nulls', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        ['one', null, 'three'] as const,
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`
        Object {
          "desktop": "three_desktop",
          "mobile": "one_mobile",
        }
      `);
    });

    it('should handle responsive arrays with only nulls', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        [null, null, null] as const,
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`Object {}`);
    });

    it('should handle conditional objects', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        { mobile: 'one', desktop: 'three' } as const,
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`
        Object {
          "desktop": "three_desktop",
          "mobile": "one_mobile",
        }
      `);
    });

    it('should handle conditional objects with undefined', () => {
      const mapValue = createMapValueFn(conditionalProperties);
      const value = mapValue(
        { mobile: 'one', tablet: undefined, desktop: 'three' } as const,
        (value, key) => `${value}_${key}` as const,
      );

      expect(value).toMatchInlineSnapshot(`
        Object {
          "desktop": "three_desktop",
          "mobile": "one_mobile",
        }
      `);
    });
  });

  it('should create atomic styles', () => {
    expect(propertiesWithShorthands).toMatchInlineSnapshot(`
      Object {
        "conditions": undefined,
        "styles": Object {
          "anotherPaddingX": Object {
            "mappings": Array [
              "paddingLeft",
              "paddingRight",
            ],
          },
          "color": Object {
            "values": Object {
              "gray-500": Object {
                "defaultClass": "sprinkles_color_gray-500__1kw4brea",
              },
              "green-300": Object {
                "defaultClass": "sprinkles_color_green-300__1kw4brec",
              },
              "red-500": Object {
                "defaultClass": "sprinkles_color_red-500__1kw4breb",
              },
            },
          },
          "paddingLeft": Object {
            "values": Object {
              "large": Object {
                "defaultClass": "sprinkles_paddingLeft_large__1kw4bref",
              },
              "medium": Object {
                "defaultClass": "sprinkles_paddingLeft_medium__1kw4bree",
              },
              "small": Object {
                "defaultClass": "sprinkles_paddingLeft_small__1kw4bred",
              },
            },
          },
          "paddingRight": Object {
            "values": Object {
              "large": Object {
                "defaultClass": "sprinkles_paddingRight_large__1kw4brei",
              },
              "medium": Object {
                "defaultClass": "sprinkles_paddingRight_medium__1kw4breh",
              },
              "small": Object {
                "defaultClass": "sprinkles_paddingRight_small__1kw4breg",
              },
            },
          },
          "paddingX": Object {
            "mappings": Array [
              "paddingLeft",
              "paddingRight",
            ],
          },
        },
      }
    `);
  });

  it('should create conditional atomic styles', () => {
    expect(conditionalProperties).toMatchInlineSnapshot(`
      Object {
        "conditions": Object {
          "conditionNames": Array [
            "mobile",
            "tablet",
            "desktop",
          ],
          "defaultCondition": "mobile",
          "responsiveArray": Array [
            "mobile",
            "tablet",
            "desktop",
          ],
        },
        "styles": Object {
          "display": Object {
            "responsiveArray": Array [
              "mobile",
              "tablet",
              "desktop",
            ],
            "values": Object {
              "block": Object {
                "conditions": Object {
                  "desktop": "sprinkles_display_block_desktop__1kw4brel",
                  "mobile": "sprinkles_display_block_mobile__1kw4brej",
                  "tablet": "sprinkles_display_block_tablet__1kw4brek",
                },
                "defaultClass": "sprinkles_display_block_mobile__1kw4brej",
              },
              "flex": Object {
                "conditions": Object {
                  "desktop": "sprinkles_display_flex_desktop__1kw4brer",
                  "mobile": "sprinkles_display_flex_mobile__1kw4brep",
                  "tablet": "sprinkles_display_flex_tablet__1kw4breq",
                },
                "defaultClass": "sprinkles_display_flex_mobile__1kw4brep",
              },
              "none": Object {
                "conditions": Object {
                  "desktop": "sprinkles_display_none_desktop__1kw4breo",
                  "mobile": "sprinkles_display_none_mobile__1kw4brem",
                  "tablet": "sprinkles_display_none_tablet__1kw4bren",
                },
                "defaultClass": "sprinkles_display_none_mobile__1kw4brem",
              },
            },
          },
          "opacity": Object {
            "responsiveArray": Array [
              "mobile",
              "tablet",
              "desktop",
            ],
            "values": Object {
              "0": Object {
                "conditions": Object {
                  "desktop": "sprinkles_opacity_0_desktop__1kw4bre1c",
                  "mobile": "sprinkles_opacity_0_mobile__1kw4bre1a",
                  "tablet": "sprinkles_opacity_0_tablet__1kw4bre1b",
                },
                "defaultClass": "sprinkles_opacity_0_mobile__1kw4bre1a",
              },
              "1": Object {
                "conditions": Object {
                  "desktop": "sprinkles_opacity_1_desktop__1kw4bre1f",
                  "mobile": "sprinkles_opacity_1_mobile__1kw4bre1d",
                  "tablet": "sprinkles_opacity_1_tablet__1kw4bre1e",
                },
                "defaultClass": "sprinkles_opacity_1_mobile__1kw4bre1d",
              },
            },
          },
          "paddingBottom": Object {
            "responsiveArray": Array [
              "mobile",
              "tablet",
              "desktop",
            ],
            "values": Object {
              "large": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingBottom_large_desktop__1kw4bre19",
                  "mobile": "sprinkles_paddingBottom_large_mobile__1kw4bre17",
                  "tablet": "sprinkles_paddingBottom_large_tablet__1kw4bre18",
                },
                "defaultClass": "sprinkles_paddingBottom_large_mobile__1kw4bre17",
              },
              "medium": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingBottom_medium_desktop__1kw4bre16",
                  "mobile": "sprinkles_paddingBottom_medium_mobile__1kw4bre14",
                  "tablet": "sprinkles_paddingBottom_medium_tablet__1kw4bre15",
                },
                "defaultClass": "sprinkles_paddingBottom_medium_mobile__1kw4bre14",
              },
              "small": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingBottom_small_desktop__1kw4bre13",
                  "mobile": "sprinkles_paddingBottom_small_mobile__1kw4bre11",
                  "tablet": "sprinkles_paddingBottom_small_tablet__1kw4bre12",
                },
                "defaultClass": "sprinkles_paddingBottom_small_mobile__1kw4bre11",
              },
            },
          },
          "paddingTop": Object {
            "responsiveArray": Array [
              "mobile",
              "tablet",
              "desktop",
            ],
            "values": Object {
              "large": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingTop_large_desktop__1kw4bre10",
                  "mobile": "sprinkles_paddingTop_large_mobile__1kw4brey",
                  "tablet": "sprinkles_paddingTop_large_tablet__1kw4brez",
                },
                "defaultClass": "sprinkles_paddingTop_large_mobile__1kw4brey",
              },
              "medium": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingTop_medium_desktop__1kw4brex",
                  "mobile": "sprinkles_paddingTop_medium_mobile__1kw4brev",
                  "tablet": "sprinkles_paddingTop_medium_tablet__1kw4brew",
                },
                "defaultClass": "sprinkles_paddingTop_medium_mobile__1kw4brev",
              },
              "small": Object {
                "conditions": Object {
                  "desktop": "sprinkles_paddingTop_small_desktop__1kw4breu",
                  "mobile": "sprinkles_paddingTop_small_mobile__1kw4bres",
                  "tablet": "sprinkles_paddingTop_small_tablet__1kw4bret",
                },
                "defaultClass": "sprinkles_paddingTop_small_mobile__1kw4bres",
              },
            },
          },
          "paddingY": Object {
            "mappings": Array [
              "paddingBottom",
              "paddingTop",
            ],
          },
        },
      }
    `);
  });

  it('should create conditional properties with multiple default condition classes in "defaultClass"', () => {
    expect(conditionalPropertiesWithMultipleDefaultConditions)
      .toMatchInlineSnapshot(`
      Object {
        "conditions": Object {
          "conditionNames": Array [
            "lightMode",
            "darkMode",
          ],
          "defaultCondition": Array [
            "lightMode",
            "darkMode",
          ],
          "responsiveArray": undefined,
        },
        "styles": Object {
          "background": Object {
            "values": Object {
              "blue": Object {
                "conditions": Object {
                  "darkMode": "sprinkles_background_blue_darkMode__1kw4bre1l",
                  "lightMode": "sprinkles_background_blue_lightMode__1kw4bre1k",
                },
                "defaultClass": "sprinkles_background_blue_lightMode__1kw4bre1k sprinkles_background_blue_darkMode__1kw4bre1l",
              },
              "green": Object {
                "conditions": Object {
                  "darkMode": "sprinkles_background_green_darkMode__1kw4bre1j",
                  "lightMode": "sprinkles_background_green_lightMode__1kw4bre1i",
                },
                "defaultClass": "sprinkles_background_green_lightMode__1kw4bre1i sprinkles_background_green_darkMode__1kw4bre1j",
              },
              "red": Object {
                "conditions": Object {
                  "darkMode": "sprinkles_background_red_darkMode__1kw4bre1h",
                  "lightMode": "sprinkles_background_red_lightMode__1kw4bre1g",
                },
                "defaultClass": "sprinkles_background_red_lightMode__1kw4bre1g sprinkles_background_red_darkMode__1kw4bre1h",
              },
            },
          },
        },
      }
    `);
  });
});
