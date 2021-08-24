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
  it('handles explicit vars', () => {
    expect(
      createGlobalThemeContract({
        color: {
          red: 'color-red',
          green: 'color-green',
          blue: 'color-blue',
        },
        space: {
          small: 'space-small',
          large: 'space-large',
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--color-blue)",
          "green": "var(--color-green)",
          "red": "var(--color-red)",
        },
        "space": Object {
          "large": "var(--space-large)",
          "small": "var(--space-small)",
        },
      }
    `);
  });

  it('ignores leading hyphens on explicit vars', () => {
    expect(
      createGlobalThemeContract({
        color: {
          red: '--color-red',
          green: '--color-green',
          blue: '--color-blue',
        },
        space: {
          small: '--space-small',
          large: '--space-large',
        },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--color-blue)",
          "green": "var(--color-green)",
          "red": "var(--color-red)",
        },
        "space": Object {
          "large": "var(--space-large)",
          "small": "var(--space-small)",
        },
      }
    `);
  });

  it('supports prefixing via the map function', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: 'color-red',
            green: 'color-green',
            blue: 'color-blue',
          },
          space: {
            small: 'space-small',
            large: 'space-large',
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
        "space": Object {
          "large": "var(--prefix-space-large)",
          "small": "var(--prefix-space-small)",
        },
      }
    `);
  });

  it('ignores leading hyphens when prefixing via the map function', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: 'color-red',
            green: 'color-green',
            blue: 'color-blue',
          },
          space: {
            small: 'space-small',
            large: 'space-large',
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
        "space": Object {
          "large": "var(--prefix-space-large)",
          "small": "var(--prefix-space-small)",
        },
      }
    `);
  });

  it('supports path-based values via the map function', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: null,
            green: null,
            blue: null,
          },
          space: {
            small: null,
            large: null,
          },
        },
        (_, path) => path.join('-'),
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--color-blue)",
          "green": "var(--color-green)",
          "red": "var(--color-red)",
        },
        "space": Object {
          "large": "var(--space-large)",
          "small": "var(--space-small)",
        },
      }
    `);
  });

  it('ignores leading hyphens with path-based values via the map function', () => {
    expect(
      createGlobalThemeContract(
        {
          color: {
            red: null,
            green: null,
            blue: null,
          },
          space: {
            small: null,
            large: null,
          },
        },
        (_, path) => `--prefix-${path.join('-')}`,
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "color": Object {
          "blue": "var(--prefix-color-blue)",
          "green": "var(--prefix-color-green)",
          "red": "var(--prefix-color-red)",
        },
        "space": Object {
          "large": "var(--prefix-space-large)",
          "small": "var(--prefix-space-small)",
        },
      }
    `);
  });
});
