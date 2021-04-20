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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4bre11"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4bre11 _1kw4bre0"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4bre11 _1kw4bre4"`);
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
              "desktop": "_1kw4bre11",
              "mobile": "_1kw4bre9",
              "tablet": "_1kw4bre10",
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
              "desktop": "_1kw4bre20",
              "mobile": "_1kw4bre18",
              "tablet": "_1kw4bre19",
            },
            "defaultCondition": "_1kw4bre18",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "medium": Object {
            "conditions": Object {
              "desktop": "_1kw4bre17",
              "mobile": "_1kw4bre15",
              "tablet": "_1kw4bre16",
            },
            "defaultCondition": "_1kw4bre15",
            "responsiveArray": Array [
              "mobile",
              "desktop",
              "tablet",
            ],
          },
          "small": Object {
            "conditions": Object {
              "desktop": "_1kw4bre14",
              "mobile": "_1kw4bre12",
              "tablet": "_1kw4bre13",
            },
            "defaultCondition": "_1kw4bre12",
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
