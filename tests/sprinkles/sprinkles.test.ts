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
          "gray-500": "_1kw4bre0",
          "green-300": "_1kw4bre2",
          "red-500": "_1kw4bre1",
        },
      }
    `);
  });

  it('should create conditional atomic styles', () => {
    expect(conditionalAtomicStyles).toMatchInlineSnapshot(`
      Object {
        "display": Object {
          "block": Object {
            "conditions": Object {
              "desktop": "_1kw4bre5",
              "mobile": "_1kw4bre3",
              "tablet": "_1kw4bre4",
            },
            "defaultCondition": "_1kw4bre3",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "flex": Object {
            "conditions": Object {
              "desktop": "_1kw4breb",
              "mobile": "_1kw4bre9",
              "tablet": "_1kw4brea",
            },
            "defaultCondition": "_1kw4bre9",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "none": Object {
            "conditions": Object {
              "desktop": "_1kw4bre8",
              "mobile": "_1kw4bre6",
              "tablet": "_1kw4bre7",
            },
            "defaultCondition": "_1kw4bre6",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
        },
        "paddingTop": Object {
          "large": Object {
            "conditions": Object {
              "desktop": "_1kw4brek",
              "mobile": "_1kw4brei",
              "tablet": "_1kw4brej",
            },
            "defaultCondition": "_1kw4brei",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "medium": Object {
            "conditions": Object {
              "desktop": "_1kw4breh",
              "mobile": "_1kw4bref",
              "tablet": "_1kw4breg",
            },
            "defaultCondition": "_1kw4bref",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "small": Object {
            "conditions": Object {
              "desktop": "_1kw4bree",
              "mobile": "_1kw4brec",
              "tablet": "_1kw4bred",
            },
            "defaultCondition": "_1kw4brec",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
        },
      }
    `);
  });
});
