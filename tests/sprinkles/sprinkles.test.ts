import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicStyles,
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
  conditionalStylesWithoutDefaultCondition,
} from './index.css';

describe('sprinkles', () => {
  describe('createAtomsFn', () => {
    it('should return correct classnames', () => {
      const atoms = createAtomsFn(atomicStyles);

      expect(atoms({ color: 'green-300' })).toMatchInlineSnapshot(
        `"index_color_green-300__1kw4bre2"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(atomicWithShorthandStyles);

      expect(atoms({ color: 'green-300' })).toMatchInlineSnapshot(
        `"index_color_green-300__1kw4breb"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brei"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(
        atoms({
          display: {
            mobile: 'block',
            desktop: 'flex',
          },
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brei index_display_flex_desktop__1kw4breq"`,
      );
    });

    it('should return correct classnames', () => {
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
        `"index_display_block_mobile__1kw4brei index_display_flex_desktop__1kw4breq index_color_gray-500__1kw4bre9"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', 'flex', 'block'],
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brei index_display_flex_tablet__1kw4brep index_display_block_desktop__1kw4brek"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', null, 'flex'],
        }),
      ).toMatchInlineSnapshot(
        `"index_display_block_mobile__1kw4brei index_display_flex_desktop__1kw4breq"`,
      );
    });

    it('should return correct classnames', () => {
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
          paddingTop: 'medium',
        }),
      ).toMatchInlineSnapshot(
        `"index_paddingLeft_small__1kw4brec index_paddingRight_small__1kw4bref index_paddingBottom_medium_mobile__1kw4bre13 index_paddingBottom_large_desktop__1kw4bre18 index_paddingTop_medium_mobile__1kw4breu index_paddingTop_large_desktop__1kw4brez"`,
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
        `"index_paddingBottom_small_mobile__1kw4bre10 index_paddingTop_small_mobile__1kw4brer"`,
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
        `"index_paddingLeft_small__1kw4brec index_paddingRight_small__1kw4bref"`,
      );
    });

    describe('types', () => {
      it('to be type safe', () => {
        const atoms = createAtomsFn({
          ...atomicWithShorthandStyles,
          ...conditionalAtomicStyles,
        });

        expect(() =>
          atoms({
            // @ts-expect-error
            paddingX: 'smalll',
            paddingY: {
              mobile: 'medium',
              desktop: 'large',
            },
            paddingTop: 'medium',
          }),
        ).toBeTruthy();
      });

      it('to be type safe', () => {
        const atoms = createAtomsFn({
          ...atomicWithShorthandStyles,
          ...conditionalAtomicStyles,
        });

        expect(() =>
          atoms({
            paddingX: 'small',
            paddingY: {
              // @ts-expect-error
              mobie: 'medium',
              desktop: 'large',
            },
            paddingTop: 'medium',
          }),
        ).toBeTruthy();
      });

      it('should prevent default conditions when set to false', () => {
        const atoms = createAtomsFn(conditionalStylesWithoutDefaultCondition);

        expect(() =>
          atoms({
            // @ts-expect-error
            transform: 'shrink',
          }),
        ).toBeTruthy();
      });
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
              "defaultClass": "index_color_gray-500__1kw4bre9",
            },
            "green-300": Object {
              "defaultClass": "index_color_green-300__1kw4breb",
            },
            "red-500": Object {
              "defaultClass": "index_color_red-500__1kw4brea",
            },
          },
        },
        "paddingLeft": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "index_paddingLeft_large__1kw4bree",
            },
            "medium": Object {
              "defaultClass": "index_paddingLeft_medium__1kw4bred",
            },
            "small": Object {
              "defaultClass": "index_paddingLeft_small__1kw4brec",
            },
          },
        },
        "paddingRight": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "index_paddingRight_large__1kw4breh",
            },
            "medium": Object {
              "defaultClass": "index_paddingRight_medium__1kw4breg",
            },
            "small": Object {
              "defaultClass": "index_paddingRight_small__1kw4bref",
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
                "desktop": "index_display_block_desktop__1kw4brek",
                "mobile": "index_display_block_mobile__1kw4brei",
                "tablet": "index_display_block_tablet__1kw4brej",
              },
              "defaultClass": "index_display_block_mobile__1kw4brei",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "index_display_flex_desktop__1kw4breq",
                "mobile": "index_display_flex_mobile__1kw4breo",
                "tablet": "index_display_flex_tablet__1kw4brep",
              },
              "defaultClass": "index_display_flex_mobile__1kw4breo",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "index_display_none_desktop__1kw4bren",
                "mobile": "index_display_none_mobile__1kw4brel",
                "tablet": "index_display_none_tablet__1kw4brem",
              },
              "defaultClass": "index_display_none_mobile__1kw4brel",
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
                "desktop": "index_paddingBottom_large_desktop__1kw4bre18",
                "mobile": "index_paddingBottom_large_mobile__1kw4bre16",
                "tablet": "index_paddingBottom_large_tablet__1kw4bre17",
              },
              "defaultClass": "index_paddingBottom_large_mobile__1kw4bre16",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "index_paddingBottom_medium_desktop__1kw4bre15",
                "mobile": "index_paddingBottom_medium_mobile__1kw4bre13",
                "tablet": "index_paddingBottom_medium_tablet__1kw4bre14",
              },
              "defaultClass": "index_paddingBottom_medium_mobile__1kw4bre13",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "index_paddingBottom_small_desktop__1kw4bre12",
                "mobile": "index_paddingBottom_small_mobile__1kw4bre10",
                "tablet": "index_paddingBottom_small_tablet__1kw4bre11",
              },
              "defaultClass": "index_paddingBottom_small_mobile__1kw4bre10",
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
                "desktop": "index_paddingTop_large_desktop__1kw4brez",
                "mobile": "index_paddingTop_large_mobile__1kw4brex",
                "tablet": "index_paddingTop_large_tablet__1kw4brey",
              },
              "defaultClass": "index_paddingTop_large_mobile__1kw4brex",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "index_paddingTop_medium_desktop__1kw4brew",
                "mobile": "index_paddingTop_medium_mobile__1kw4breu",
                "tablet": "index_paddingTop_medium_tablet__1kw4brev",
              },
              "defaultClass": "index_paddingTop_medium_mobile__1kw4breu",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "index_paddingTop_small_desktop__1kw4bret",
                "mobile": "index_paddingTop_small_mobile__1kw4brer",
                "tablet": "index_paddingTop_small_tablet__1kw4bres",
              },
              "defaultClass": "index_paddingTop_small_mobile__1kw4brer",
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
