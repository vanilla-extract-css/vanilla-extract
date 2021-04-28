import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicStyles,
  atomicWithShorthandStyles,
  atomicWithPaddingShorthandStyles,
  conditionalAtomicStyles,
} from './index.css';

describe('sprinkles', () => {
  describe('createAtomsFn', () => {
    it('should handle unconditional styles', () => {
      const atoms = createAtomsFn(atomicStyles);

      expect(atoms({ top: 0, color: 'green-300' })).toMatchInlineSnapshot(
        `"sprinkles_top_0__1kw4bre3 sprinkles_color_green-300__1kw4bre2"`,
      );
    });

    it('should handle default classes on conditional styles', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev"`,
      );
    });

    it('should handle conditional styles with different variants', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev sprinkles_display_flex_desktop__1kw4bre13"`,
      );
    });

    it('should handle a mix of unconditional and conditional styles', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
          color: 'gray-500',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev sprinkles_display_flex_desktop__1kw4bre13 sprinkles_color_gray-500__1kw4brem"`,
      );
    });

    it('should handle responsive arrays', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          display: ['block', 'flex', 'block'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev sprinkles_display_flex_tablet__1kw4bre12 sprinkles_display_block_desktop__1kw4brex"`,
      );
    });

    it('should handle responsive arrays with null values', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          display: ['block', null, 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev sprinkles_display_flex_desktop__1kw4bre13"`,
      );
    });

    it('should handle responsive arrays that end early', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          display: ['block', 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_display_block_mobile__1kw4brev sprinkles_display_flex_tablet__1kw4bre12"`,
      );
    });

    it('should handle shorthand properties with a default condition', () => {
      const atoms = createAtomsFn(atomicWithShorthandStyles);

      expect(
        atoms({
          paddingX: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_large__1kw4brer sprinkles_paddingRight_large__1kw4breu"`,
      );
    });

    it('should handle shorthand properties with a conditional value', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          paddingY: {
            mobile: 'medium',
            tablet: 'large',
          },
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_medium_mobile__1kw4bre17 sprinkles_paddingTop_large_tablet__1kw4bre1b sprinkles_paddingBottom_medium_mobile__1kw4bre1g sprinkles_paddingBottom_large_tablet__1kw4bre1k"`,
      );
    });

    it('should handle shorthand properties with a responsive array', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          paddingY: ['small', 'medium', 'large'],
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_small_mobile__1kw4bre14 sprinkles_paddingTop_medium_tablet__1kw4bre18 sprinkles_paddingTop_large_desktop__1kw4bre1c sprinkles_paddingBottom_small_mobile__1kw4bre1d sprinkles_paddingBottom_medium_tablet__1kw4bre1h sprinkles_paddingBottom_large_desktop__1kw4bre1l"`,
      );
    });

    it('should merge shorthand styles with non-shorthands', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          paddingX: 'small',
          paddingY: {
            mobile: 'medium',
            desktop: 'large',
          },
          paddingTop: 'small',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_small__1kw4brep sprinkles_paddingRight_small__1kw4bres sprinkles_paddingTop_small_mobile__1kw4bre14 sprinkles_paddingBottom_medium_mobile__1kw4bre1g sprinkles_paddingBottom_large_desktop__1kw4bre1l"`,
      );
    });

    it('should preserve config order of shorthands', () => {
      const atoms = createAtomsFn(atomicWithPaddingShorthandStyles);

      throw new Error('Broken test');

      expect(
        atoms({
          paddingTop: 'small',
          paddingX: 'small',
          paddingY: 'medium',
          padding: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_large__1kw4brec sprinkles_paddingRight_large__1kw4bref sprinkles_paddingTop_small__1kw4breg sprinkles_paddingBottom_large__1kw4brel"`,
      );
    });

    it('should ignore undefined longhand values when resolving shorthands', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          paddingY: 'small',
          paddingTop: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingTop_small_mobile__1kw4bre14 sprinkles_paddingBottom_small_mobile__1kw4bre1d"`,
      );
    });

    it('should ignore undefined shorthand values when resolving shorthands', () => {
      const atoms = createAtomsFn(
        atomicWithShorthandStyles,
        conditionalAtomicStyles,
      );

      expect(
        atoms({
          paddingX: 'small',
          anotherPaddingX: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"sprinkles_paddingLeft_small__1kw4brep sprinkles_paddingRight_small__1kw4bres"`,
      );
    });
  });

  it('should create atomic styles', () => {
    expect(atomicWithShorthandStyles).toMatchInlineSnapshot(`
      Object {
        "anotherPaddingX": Object {
          "mappings": Array [
            "paddingLeft",
            "paddingRight",
          ],
        },
        "color": Object {
          "values": Object {
            "gray-500": Object {
              "defaultClass": "sprinkles_color_gray-500__1kw4brem",
            },
            "green-300": Object {
              "defaultClass": "sprinkles_color_green-300__1kw4breo",
            },
            "red-500": Object {
              "defaultClass": "sprinkles_color_red-500__1kw4bren",
            },
          },
        },
        "paddingLeft": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "sprinkles_paddingLeft_large__1kw4brer",
            },
            "medium": Object {
              "defaultClass": "sprinkles_paddingLeft_medium__1kw4breq",
            },
            "small": Object {
              "defaultClass": "sprinkles_paddingLeft_small__1kw4brep",
            },
          },
        },
        "paddingRight": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "sprinkles_paddingRight_large__1kw4breu",
            },
            "medium": Object {
              "defaultClass": "sprinkles_paddingRight_medium__1kw4bret",
            },
            "small": Object {
              "defaultClass": "sprinkles_paddingRight_small__1kw4bres",
            },
          },
        },
        "paddingX": Object {
          "mappings": Array [
            "paddingLeft",
            "paddingRight",
          ],
        },
      }
    `);
  });

  it('should create conditional atomic styles', () => {
    expect(conditionalAtomicStyles).toMatchInlineSnapshot(`
      Object {
        "display": Object {
          "responsiveArray": Array [
            "mobile",
            "tablet",
            "desktop",
          ],
          "values": Object {
            "block": Object {
              "conditions": Object {
                "desktop": "sprinkles_display_block_desktop__1kw4brex",
                "mobile": "sprinkles_display_block_mobile__1kw4brev",
                "tablet": "sprinkles_display_block_tablet__1kw4brew",
              },
              "defaultClass": "sprinkles_display_block_mobile__1kw4brev",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "sprinkles_display_flex_desktop__1kw4bre13",
                "mobile": "sprinkles_display_flex_mobile__1kw4bre11",
                "tablet": "sprinkles_display_flex_tablet__1kw4bre12",
              },
              "defaultClass": "sprinkles_display_flex_mobile__1kw4bre11",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "sprinkles_display_none_desktop__1kw4bre10",
                "mobile": "sprinkles_display_none_mobile__1kw4brey",
                "tablet": "sprinkles_display_none_tablet__1kw4brez",
              },
              "defaultClass": "sprinkles_display_none_mobile__1kw4brey",
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
                "desktop": "sprinkles_paddingBottom_large_desktop__1kw4bre1l",
                "mobile": "sprinkles_paddingBottom_large_mobile__1kw4bre1j",
                "tablet": "sprinkles_paddingBottom_large_tablet__1kw4bre1k",
              },
              "defaultClass": "sprinkles_paddingBottom_large_mobile__1kw4bre1j",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "sprinkles_paddingBottom_medium_desktop__1kw4bre1i",
                "mobile": "sprinkles_paddingBottom_medium_mobile__1kw4bre1g",
                "tablet": "sprinkles_paddingBottom_medium_tablet__1kw4bre1h",
              },
              "defaultClass": "sprinkles_paddingBottom_medium_mobile__1kw4bre1g",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "sprinkles_paddingBottom_small_desktop__1kw4bre1f",
                "mobile": "sprinkles_paddingBottom_small_mobile__1kw4bre1d",
                "tablet": "sprinkles_paddingBottom_small_tablet__1kw4bre1e",
              },
              "defaultClass": "sprinkles_paddingBottom_small_mobile__1kw4bre1d",
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
                "desktop": "sprinkles_paddingTop_large_desktop__1kw4bre1c",
                "mobile": "sprinkles_paddingTop_large_mobile__1kw4bre1a",
                "tablet": "sprinkles_paddingTop_large_tablet__1kw4bre1b",
              },
              "defaultClass": "sprinkles_paddingTop_large_mobile__1kw4bre1a",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "sprinkles_paddingTop_medium_desktop__1kw4bre19",
                "mobile": "sprinkles_paddingTop_medium_mobile__1kw4bre17",
                "tablet": "sprinkles_paddingTop_medium_tablet__1kw4bre18",
              },
              "defaultClass": "sprinkles_paddingTop_medium_mobile__1kw4bre17",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "sprinkles_paddingTop_small_desktop__1kw4bre16",
                "mobile": "sprinkles_paddingTop_small_mobile__1kw4bre14",
                "tablet": "sprinkles_paddingTop_small_tablet__1kw4bre15",
              },
              "defaultClass": "sprinkles_paddingTop_small_mobile__1kw4bre14",
            },
          },
        },
        "paddingY": Object {
          "mappings": Array [
            "paddingBottom",
            "paddingTop",
          ],
        },
      }
    `);
  });
});
