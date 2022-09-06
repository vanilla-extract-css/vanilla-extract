import { setFileScope, endFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

describe('identifier', () => {
  beforeAll(() => {
    setFileScope('test.css.ts');
  });

  afterAll(() => {
    endFileScope();
  });

  it(`should ignore file scopes without a file extension when creating a path prefix`, () => {
    setFileScope('test');
    expect(generateIdentifier(undefined)).toMatchInlineSnapshot(`"skkcyc0"`);
    endFileScope();
  });

  it(`should create a valid identifier`, () => {
    expect(generateIdentifier(undefined)).toMatchInlineSnapshot(
      `"test__q11bah0"`,
    );
  });

  it('should create a valid identifier with a debug id', () => {
    expect(generateIdentifier('debug')).toMatchInlineSnapshot(
      `"test_debug__q11bah1"`,
    );
  });

  it('should create a valid identifier with a debug id with whitespace', () => {
    expect(generateIdentifier('debug and more')).toMatchInlineSnapshot(
      `"test_debug_and_more__q11bah2"`,
    );
  });

  describe('options object', () => {
    it(`should create a valid identifier`, () => {
      expect(generateIdentifier({})).toMatchInlineSnapshot(`"test__q11bah3"`);
    });

    it('should create a valid identifier with a debug id abd with file path explicitly enabled', () => {
      expect(
        generateIdentifier({ debugId: 'debug', includeFilePath: true }),
      ).toMatchInlineSnapshot(`"test_debug__q11bah4"`);
    });

    it('should create a valid identifier with a debug id and without a file path', () => {
      expect(
        generateIdentifier({ debugId: 'debug', includeFilePath: false }),
      ).toMatchInlineSnapshot(`"debug__q11bah5"`);
    });

    it('should create a valid identifier without a debug ID or file path', () => {
      expect(
        generateIdentifier({ includeFilePath: false }),
      ).toMatchInlineSnapshot(`"q11bah6"`);
    });
  });
});
