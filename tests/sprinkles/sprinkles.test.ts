import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicStyles,
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
} from './index.css';

describe('sprinkles', () => {
  describe('createAtomsFn', () => {
    it('should handle unconditional styles', () => {
      const atoms = createAtomsFn(atomicStyles);

      expect(atoms({ top: 0, color: 'green-300' })).toMatchInlineSnapshot(
        `"index_top_0__1kw4bre3 index_color_green-300__1kw4bre2"`,
      );
    });

    it('should handle default classes on conditional styles', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brej"`,
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
        `"index_display_block_mobile__1kw4brej index_display_flex_desktop__1kw4brer"`,
      );
    });

    it('should handle a mix of unconditional and conditional styles', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
          color: 'gray-500',
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brej index_display_flex_desktop__1kw4brer index_color_gray-500__1kw4brea"`,
      );
    });

    it('should handle responsive arrays', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', 'flex', 'block'],
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brej index_display_flex_tablet__1kw4breq index_display_block_desktop__1kw4brel"`,
      );
    });

    it('should handle responsive arrays with null values', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', null, 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brej index_display_flex_desktop__1kw4brer"`,
      );
    });

    it('should handle responsive arrays that end early', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          display: ['block', 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brej index_display_flex_tablet__1kw4breq"`,
      );
    });

    it('should handle shorthand properties with a default condition', () => {
      const atoms = createAtomsFn(atomicWithShorthandStyles);

      expect(
        atoms({
          paddingX: 'large',
        }),
      ).toMatchInlineSnapshot(
        `"index_paddingLeft_large__1kw4bref index_paddingRight_large__1kw4brei"`,
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
        `"index_paddingBottom_medium_mobile__1kw4bre14 index_paddingBottom_large_tablet__1kw4bre18 index_paddingTop_medium_mobile__1kw4brev index_paddingTop_large_tablet__1kw4brez"`,
      );
    });

    it('should handle shorthand properties with a responsive array', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          paddingY: ['small', 'medium', 'large'],
        }),
      ).toMatchInlineSnapshot(
        `"index_paddingBottom_small_mobile__1kw4bre11 index_paddingBottom_medium_tablet__1kw4bre15 index_paddingBottom_large_desktop__1kw4bre19 index_paddingTop_small_mobile__1kw4bres index_paddingTop_medium_tablet__1kw4brew index_paddingTop_large_desktop__1kw4bre10"`,
      );
    });

    it('should merge shorthand styles with non-shorthands', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

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
        `"index_paddingLeft_small__1kw4bred index_paddingRight_small__1kw4breg index_paddingBottom_medium_mobile__1kw4bre14 index_paddingBottom_large_desktop__1kw4bre19 index_paddingTop_small_mobile__1kw4bres"`,
      );
    });

    it('should ignore undefined longhand values when resolving shorthands', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          paddingY: 'small',
          paddingTop: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"index_paddingBottom_small_mobile__1kw4bre11 index_paddingTop_small_mobile__1kw4bres"`,
      );
    });

    it('should ignore undefined shorthand values when resolving shorthands', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          paddingX: 'small',
          anotherPaddingX: undefined,
        }),
      ).toMatchInlineSnapshot(
        `"index_paddingLeft_small__1kw4bred index_paddingRight_small__1kw4breg"`,
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
              "defaultClass": "index_color_gray-500__1kw4brea",
            },
            "green-300": Object {
              "defaultClass": "index_color_green-300__1kw4brec",
            },
            "red-500": Object {
              "defaultClass": "index_color_red-500__1kw4breb",
            },
          },
        },
        "paddingLeft": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "index_paddingLeft_large__1kw4bref",
            },
            "medium": Object {
              "defaultClass": "index_paddingLeft_medium__1kw4bree",
            },
            "small": Object {
              "defaultClass": "index_paddingLeft_small__1kw4bred",
            },
          },
        },
        "paddingRight": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "index_paddingRight_large__1kw4brei",
            },
            "medium": Object {
              "defaultClass": "index_paddingRight_medium__1kw4breh",
            },
            "small": Object {
              "defaultClass": "index_paddingRight_small__1kw4breg",
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
                "desktop": "index_display_block_desktop__1kw4brel",
                "mobile": "index_display_block_mobile__1kw4brej",
                "tablet": "index_display_block_tablet__1kw4brek",
              },
              "defaultClass": "index_display_block_mobile__1kw4brej",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "index_display_flex_desktop__1kw4brer",
                "mobile": "index_display_flex_mobile__1kw4brep",
                "tablet": "index_display_flex_tablet__1kw4breq",
              },
              "defaultClass": "index_display_flex_mobile__1kw4brep",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "index_display_none_desktop__1kw4breo",
                "mobile": "index_display_none_mobile__1kw4brem",
                "tablet": "index_display_none_tablet__1kw4bren",
              },
              "defaultClass": "index_display_none_mobile__1kw4brem",
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
                "desktop": "index_paddingBottom_large_desktop__1kw4bre19",
                "mobile": "index_paddingBottom_large_mobile__1kw4bre17",
                "tablet": "index_paddingBottom_large_tablet__1kw4bre18",
              },
              "defaultClass": "index_paddingBottom_large_mobile__1kw4bre17",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "index_paddingBottom_medium_desktop__1kw4bre16",
                "mobile": "index_paddingBottom_medium_mobile__1kw4bre14",
                "tablet": "index_paddingBottom_medium_tablet__1kw4bre15",
              },
              "defaultClass": "index_paddingBottom_medium_mobile__1kw4bre14",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "index_paddingBottom_small_desktop__1kw4bre13",
                "mobile": "index_paddingBottom_small_mobile__1kw4bre11",
                "tablet": "index_paddingBottom_small_tablet__1kw4bre12",
              },
              "defaultClass": "index_paddingBottom_small_mobile__1kw4bre11",
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
                "desktop": "index_paddingTop_large_desktop__1kw4bre10",
                "mobile": "index_paddingTop_large_mobile__1kw4brey",
                "tablet": "index_paddingTop_large_tablet__1kw4brez",
              },
              "defaultClass": "index_paddingTop_large_mobile__1kw4brey",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "index_paddingTop_medium_desktop__1kw4brex",
                "mobile": "index_paddingTop_medium_mobile__1kw4brev",
                "tablet": "index_paddingTop_medium_tablet__1kw4brew",
              },
              "defaultClass": "index_paddingTop_medium_mobile__1kw4brev",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "index_paddingTop_small_desktop__1kw4breu",
                "mobile": "index_paddingTop_small_mobile__1kw4bres",
                "tablet": "index_paddingTop_small_tablet__1kw4bret",
              },
              "defaultClass": "index_paddingTop_small_mobile__1kw4bres",
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
