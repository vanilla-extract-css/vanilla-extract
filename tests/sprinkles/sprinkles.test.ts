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

      expect(atoms({ display: 'block' })).toMatchInlineSnapshot(`"_1kw4bre3"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4breb"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4breb _1kw4bre0"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4breb _1kw4bre4"`);
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
                "desktop": "_1kw4bre5",
                "mobile": "_1kw4bre3",
                "tablet": "_1kw4bre4",
              },
              "defaultClass": "_1kw4bre3",
            },
            "flex": Object {
              "conditions": Object {
                "desktop": "_1kw4breb",
                "mobile": "_1kw4bre9",
                "tablet": "_1kw4brea",
              },
              "defaultClass": "_1kw4bre9",
            },
            "none": Object {
              "conditions": Object {
                "desktop": "_1kw4bre8",
                "mobile": "_1kw4bre6",
                "tablet": "_1kw4bre7",
              },
              "defaultClass": "_1kw4bre6",
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
                "desktop": "_1kw4brek",
                "mobile": "_1kw4brei",
                "tablet": "_1kw4brej",
              },
              "defaultClass": "_1kw4brei",
            },
            "medium": Object {
              "conditions": Object {
                "desktop": "_1kw4breh",
                "mobile": "_1kw4bref",
                "tablet": "_1kw4breg",
              },
              "defaultClass": "_1kw4bref",
            },
            "small": Object {
              "conditions": Object {
                "desktop": "_1kw4bree",
                "mobile": "_1kw4brec",
                "tablet": "_1kw4bred",
              },
              "defaultClass": "_1kw4brec",
            },
          },
        },
      }
    `);
  });
});
