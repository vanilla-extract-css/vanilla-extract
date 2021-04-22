import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import { atomicStyles, conditionalAtomicStyles } from './index.css';

describe('sprinkles', () => {
  describe('createAtomsFn', () => {
    it('should return correct classnames', () => {
      const atoms = createAtomsFn(atomicStyles);

      expect(atoms({ color: 'green-300' })).toMatchInlineSnapshot(
        `"_1kw4bre2"`,
      );
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn(conditionalAtomicStyles);

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(`"_1kw4bre9"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre9 _1kw4breh"`);
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicStyles,
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
      ).toMatchInlineSnapshot(`"_1kw4bre9 _1kw4breh _1kw4bre0"`);
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', 'flex', 'block'],
        }),
      ).toMatchInlineSnapshot(`"_1kw4bre9 _1kw4breh _1kw4brea"`);
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicStyles,
        ...conditionalAtomicStyles,
      });

      expect(
        atoms({
          display: ['block', null, 'flex'],
        }),
      ).toMatchInlineSnapshot(`"_1kw4bre9 _1kw4brea"`);
    });

    it('should return correct classnames', () => {
      const atoms = createAtomsFn({
        ...atomicStyles,
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
        `"_1kw4bre3 _1kw4bre6 _1kw4breu _1kw4brez _1kw4brel"`,
      );
    });
  });

  it('should create atomic styles', () => {
    expect(atomicStyles).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "values": Object {
            "gray-500": Object {
              "defaultClass": "_1kw4bre0",
            },
            "green-300": Object {
              "defaultClass": "_1kw4bre2",
            },
            "red-500": Object {
              "defaultClass": "_1kw4bre1",
            },
          },
        },
        "paddingLeft": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "_1kw4bre5",
            },
            "medium": Object {
              "defaultClass": "_1kw4bre4",
            },
            "small": Object {
              "defaultClass": "_1kw4bre3",
            },
          },
        },
        "paddingRight": Object {
          "values": Object {
            "large": Object {
              "defaultClass": "_1kw4bre8",
            },
            "medium": Object {
              "defaultClass": "_1kw4bre7",
            },
            "small": Object {
              "defaultClass": "_1kw4bre6",
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
            "desktop",
            "tablet",
          ],
          "values": Object {
            "block": Object {
              "conditions": Object {
                "desktop": "_1kw4breb",
                "mobile": "_1kw4bre9",
                "tablet": "_1kw4brea",
              },
              "defaultClass": "_1kw4bre9",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "_1kw4breh",
                "mobile": "_1kw4bref",
                "tablet": "_1kw4breg",
              },
              "defaultClass": "_1kw4bref",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "_1kw4bree",
                "mobile": "_1kw4brec",
                "tablet": "_1kw4bred",
              },
              "defaultClass": "_1kw4brec",
            },
          },
        },
        "paddingBottom": Object {
          "responsiveArray": Array [
            "mobile",
            "desktop",
            "tablet",
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
        "paddingTop": Object {
          "responsiveArray": Array [
            "mobile",
            "desktop",
            "tablet",
          ],
          "values": Object {
            "large": Object {
              "conditions": Object {
                "desktop": "_1kw4breq",
                "mobile": "_1kw4breo",
                "tablet": "_1kw4brep",
              },
              "defaultClass": "_1kw4breo",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "_1kw4bren",
                "mobile": "_1kw4brel",
                "tablet": "_1kw4brem",
              },
              "defaultClass": "_1kw4brel",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "_1kw4brek",
                "mobile": "_1kw4brei",
                "tablet": "_1kw4brej",
              },
              "defaultClass": "_1kw4brei",
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
