import { expect, describe, it } from 'vitest';

import { fallbackVar, createGlobalThemeContract } from './vars';

describe('fallbackVar', () => {
  it('supports a single string fallback', () => {
    expect(fallbackVar('var(--foo-bar)', 'blue')).toMatchInlineSnapshot(
      `"var(--foo-bar, blue)"`,
    );
  });

  it('supports a single numeric fallback', () => {
    expect(fallbackVar('var(--foo-bar)', '10px')).toMatchInlineSnapshot(
      `"var(--foo-bar, 10px)"`,
    );
  });

  it('supports a single var fallback', () => {
    expect(fallbackVar('var(--foo-bar)', 'var(--baz)')).toMatchInlineSnapshot(
      `"var(--foo-bar, var(--baz))"`,
    );
  });

  it('supports multiple fallbacks resolving to a string', () => {
    expect(
      fallbackVar('var(--foo)', 'var(--bar)', 'var(--baz)', 'blue'),
    ).toMatchInlineSnapshot(`"var(--foo, var(--bar, var(--baz, blue)))"`);
  });

  it('supports multiple fallbacks resolving to a number', () => {
    expect(
      fallbackVar('var(--foo)', 'var(--bar)', 'var(--baz)', '10px'),
    ).toMatchInlineSnapshot(`"var(--foo, var(--bar, var(--baz, 10px)))"`);
  });

  it('supports multiple fallbacks resolving to a var', () => {
    expect(
      fallbackVar(
        'var(--foo)',
        'var(--bar)',
        'var(--baz)',
        'var(--final-fallback)',
      ),
    ).toMatchInlineSnapshot(
      `"var(--foo, var(--bar, var(--baz, var(--final-fallback))))"`,
    );
  });

  it('should throw with invalid vars', () => {
    expect(() => {
      fallbackVar('INVALID', '10px');
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name: INVALID"`);

    expect(() => {
      fallbackVar('INVALID1', 'INVALID2', '10px');
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name: INVALID2"`);

    expect(() => {
      // @ts-expect-error
      fallbackVar('INVALID', 10, 10);
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name: 10"`);

    expect(() => {
      fallbackVar('var(--foo-bar)', 'INVALID', '10px');
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name: INVALID"`);

    expect(() => {
      fallbackVar('INVALID', 'var(--foo-bar)', '10px');
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid variable name: INVALID"`);
  });
});

describe('createGlobalThemeContract', () => {
  it('supports defining css vars via object properties', () => {
    expect(
      createGlobalThemeContract({
        color: {
          red: 'color-red',
          blue: 'color-blue',
          green: 'color-green',
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--color-blue)",
          "green": "var(--color-green)",
          "red": "var(--color-red)",
        },
      }
    `);
  });

  it('ignores leading double hyphen', () => {
    expect(
      createGlobalThemeContract({
        color: {
          red: '--color-red',
          blue: '--color-blue',
          green: '--color-green',
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--color-blue)",
          "green": "var(--color-green)",
          "red": "var(--color-red)",
        },
      }
    `);
  });

  it('supports adding a prefix', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: 'color-red',
            blue: 'color-blue',
            green: 'color-green',
          },
        },
        (value) => `prefix-${value}`,
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--prefix-color-blue)",
          "green": "var(--prefix-color-green)",
          "red": "var(--prefix-color-red)",
        },
      }
    `);
  });

  it('ignores leading double hyphen when adding a prefix', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: 'color-red',
            blue: 'color-blue',
            green: 'color-green',
          },
        },
        (value) => `--prefix-${value}`,
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--prefix-color-blue)",
          "green": "var(--prefix-color-green)",
          "red": "var(--prefix-color-red)",
        },
      }
    `);
  });

  it('supports path based names', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: null,
            blue: null,
            green: null,
          },
        },
        (_, path) => `prefix-${path.join('-')}`,
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--prefix-color-blue)",
          "green": "var(--prefix-color-green)",
          "red": "var(--prefix-color-red)",
        },
      }
    `);
  });

  it('errors when invalid property value', () => {
    expect(() =>
      createGlobalThemeContract({
        color: {
          // @ts-expect-error
          red: null,
          blue: 'color-blue',
          green: 'color-green',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid variable name for \\"color.red\\": null"`,
    );
  });

  it('errors when escaped property value', () => {
    expect(() =>
      createGlobalThemeContract({
        color: {
          red: 'color-red',
          blue: "color'blue",
          green: 'color-green',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid variable name for \\"color.blue\\": color'blue"`,
    );
  });

  it('errors when property value starts with a number', () => {
    expect(() =>
      createGlobalThemeContract({
        color: {
          red: 'color-red',
          blue: 'color-blue',
          green: '123-color-green',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid variable name for \\"color.green\\": 123-color-green"`,
    );
  });

  it('errors when invalid map value', () => {
    expect(() =>
      createGlobalThemeContract(
        {
          color: {
            red: 'color-red',
            blue: 'color-blue',
            green: 'color-green',
          },
        },
        // @ts-expect-error
        () => null,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid variable name for \\"color.red\\": null"`,
    );
  });
});
