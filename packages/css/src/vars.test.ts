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
    ).toMatchSnapshot();
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
    ).toMatchSnapshot();
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
    ).toMatchSnapshot();
  });
  it('errors when invalid property value', () => {
    expect(() =>
      createGlobalThemeContract({
        color: {
          red: null,
          blue: null,
          green: null,
        },
      }),
    ).toThrow();
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
    ).toThrow();
  });
});
