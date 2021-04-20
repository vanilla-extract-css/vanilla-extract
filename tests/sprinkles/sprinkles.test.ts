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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4bre8"`);
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
      ).toMatchInlineSnapshot(`"_1kw4bre3 _1kw4bre8 _1kw4bre0"`);
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
              "desktop": "_1kw4bre4",
              "mobile": "_1kw4bre3",
            },
            "defaultCondition": "_1kw4bre3",
          },
          "flex": Object {
            "conditions": Object {
              "desktop": "_1kw4bre8",
              "mobile": "_1kw4bre7",
            },
            "defaultCondition": "_1kw4bre7",
          },
          "none": Object {
            "conditions": Object {
              "desktop": "_1kw4bre6",
              "mobile": "_1kw4bre5",
            },
            "defaultCondition": "_1kw4bre5",
          },
        },
        "paddingTop": Object {
          "large": Object {
            "conditions": Object {
              "desktop": "_1kw4bre14",
              "mobile": "_1kw4bre13",
            },
            "defaultCondition": "_1kw4bre13",
          },
          "medium": Object {
            "conditions": Object {
              "desktop": "_1kw4bre12",
              "mobile": "_1kw4bre11",
            },
            "defaultCondition": "_1kw4bre11",
          },
          "small": Object {
            "conditions": Object {
              "desktop": "_1kw4bre10",
              "mobile": "_1kw4bre9",
            },
            "defaultCondition": "_1kw4bre9",
          },
        },
      }
    `);
  });
});
