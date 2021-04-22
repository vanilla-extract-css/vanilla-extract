import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import {
  atomicStyles,
  atomicWithShorthandStyles,
  conditionalAtomicStyles,
} from './index.css';

describe('sprinkles', () => {
  describe('createAtomsFn', () => {
    it('should return correct classnames', () => {
      const atoms = createAtomsFn(atomicStyles);

      expect(atoms({ color: 'green-300' })).toMatchInlineSnapshot(
        `"_1kw4bre2"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(atomicWithShorthandStyles);

      expect(atoms({ color: 'green-300' })).toMatchInlineSnapshot(
        `"_1kw4breb"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(`"_1kw4brei"`);
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
      ).toMatchInlineSnapshot(`"_1kw4brei _1kw4breq"`);
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
      ).toMatchInlineSnapshot(`"_1kw4brei _1kw4breq _1kw4bre9"`);
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
      ).toMatchInlineSnapshot(`"_1kw4brei _1kw4brep _1kw4brek"`);
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
      ).toMatchInlineSnapshot(`"_1kw4brei _1kw4breq"`);
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
        `"_1kw4brec _1kw4bref _1kw4bre13 _1kw4bre18 _1kw4breu"`,
      );
    });

    describe('types', () => {
      const atoms = createAtomsFn({
        ...atomicWithShorthandStyles,
        ...conditionalAtomicStyles,
      });

      it('to be type safe', () => {
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
    });
  });

  it('should create atomic styles', () => {
    expect(atomicWithShorthandStyles).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "values": Object {
            "gray-500": Object {
              "defaultClass": "_1kw4bre9",
            },
            "green-300": Object {
              "defaultClass": "_1kw4breb",
            },
            "red-500": Object {
              "defaultClass": "_1kw4brea",
            },
          },
        },
        "paddingLeft": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "_1kw4bree",
            },
            "medium": Object {
              "defaultClass": "_1kw4bred",
            },
            "small": Object {
              "defaultClass": "_1kw4brec",
            },
          },
        },
        "paddingRight": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "_1kw4breh",
            },
            "medium": Object {
              "defaultClass": "_1kw4breg",
            },
            "small": Object {
              "defaultClass": "_1kw4bref",
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
                "desktop": "_1kw4brek",
                "mobile": "_1kw4brei",
                "tablet": "_1kw4brej",
              },
              "defaultClass": "_1kw4brei",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "_1kw4breq",
                "mobile": "_1kw4breo",
                "tablet": "_1kw4brep",
              },
              "defaultClass": "_1kw4breo",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "_1kw4bren",
                "mobile": "_1kw4brel",
                "tablet": "_1kw4brem",
              },
              "defaultClass": "_1kw4brel",
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
                "desktop": "_1kw4bre18",
                "mobile": "_1kw4bre16",
                "tablet": "_1kw4bre17",
              },
              "defaultClass": "_1kw4bre16",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "_1kw4bre15",
                "mobile": "_1kw4bre13",
                "tablet": "_1kw4bre14",
              },
              "defaultClass": "_1kw4bre13",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "_1kw4bre12",
                "mobile": "_1kw4bre10",
                "tablet": "_1kw4bre11",
              },
              "defaultClass": "_1kw4bre10",
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
                "desktop": "_1kw4brez",
                "mobile": "_1kw4brex",
                "tablet": "_1kw4brey",
              },
              "defaultClass": "_1kw4brex",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "_1kw4brew",
                "mobile": "_1kw4breu",
                "tablet": "_1kw4brev",
              },
              "defaultClass": "_1kw4breu",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "_1kw4bret",
                "mobile": "_1kw4brer",
                "tablet": "_1kw4bres",
              },
              "defaultClass": "_1kw4brer",
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
