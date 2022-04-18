import { removeAdapter, setAdapter } from './adapter';
import { setFileScope, endFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

describe('identifier', () => {
  beforeAll(() => {
    setFileScope('test');
  });

  afterAll(() => {
    endFileScope();
  });

  it(`should create a valid identifier`, () => {
    expect(generateIdentifier(undefined)).toMatchInlineSnapshot(`"skkcyc0"`);
  });

  it('should create a valid identifier with a debug id', () => {
    expect(generateIdentifier('debug')).toMatchInlineSnapshot(
      `"debug__skkcyc1"`,
    );
  });

  it('should create a valid identifier with a debug id with whitespace', () => {
    expect(generateIdentifier('debug and more')).toMatchInlineSnapshot(
      `"debug_and_more__skkcyc2"`,
    );
  });

  describe('with custom callback', () => {
    beforeAll(() => {
      setAdapter({
        appendCss: () => {},
        registerClassName: () => {},
        onEndFileScope: () => {},
        registerComposition: () => {},
        markCompositionUsed: () => {},
        getIdentOption: () => (scope, index, dbg) =>
          `abc_${dbg}_${scope}_${index}`,
      });
    });

    afterAll(() => {
      removeAdapter();
    });

    it('defers to a custom callback', () => {
      expect(generateIdentifier(`a`)).toMatchInlineSnapshot(`"abc_a_test_3"`);
    });

    it('rejects invalid identifiers', () => {
      // getIdentOption() does not remove spaces from the debug info so the
      // resulting identifier should be invalid here.
      expect(() => generateIdentifier(`a b`)).toThrow();
    });
  });
});
