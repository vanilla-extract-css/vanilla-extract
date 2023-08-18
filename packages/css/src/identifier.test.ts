import { removeAdapter, setAdapter } from './adapter';
import { endFileScope, setFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

describe('identifier', () => {
  beforeAll(() => {
    setFileScope('path/to/file.css.ts');
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
      `"file__18bazsm0"`,
    );
  });

  it('should create a valid identifier with a debug id', () => {
    expect(generateIdentifier('debug')).toMatchInlineSnapshot(
      `"file_debug__18bazsm1"`,
    );
  });

  it('should create a valid identifier with a debug id with whitespace', () => {
    expect(generateIdentifier('debug and more')).toMatchInlineSnapshot(
      `"file_debug_and_more__18bazsm2"`,
    );
  });

  describe('options object', () => {
    it(`should create a valid identifier`, () => {
      expect(generateIdentifier({})).toMatchInlineSnapshot(`"file__18bazsm3"`);
    });

    it('should create a valid identifier with a debug id and with file name debugging explicitly enabled', () => {
      expect(
        generateIdentifier({ debugId: 'debug', debugFileName: true }),
      ).toMatchInlineSnapshot(`"file_debug__18bazsm4"`);
    });

    it('should create a valid identifier with a debug id and without file name debugging', () => {
      expect(
        generateIdentifier({ debugId: 'debug', debugFileName: false }),
      ).toMatchInlineSnapshot(`"debug__18bazsm5"`);
    });

    it('should create a valid identifier without a debug ID or file name', () => {
      expect(
        generateIdentifier({ debugFileName: false }),
      ).toMatchInlineSnapshot(`"_18bazsm6"`);
    });
  });

  describe('with custom callback', () => {
    beforeAll(() => {
      setFileScope('path/to/file.css.ts', 'packagetest');
      setAdapter({
        appendCss: () => {},
        registerClassName: () => {},
        onEndFileScope: () => {},
        registerComposition: () => {},
        markCompositionUsed: () => {},
        getIdentOption:
          () =>
          ({ hash, debugId, filePath, packageName }) => {
            const filenameWithExtension = filePath?.split('/').pop();
            const filenameWithoutExtension =
              filenameWithExtension?.split('.')?.[0];

            return `abc_${debugId}_${hash}_${packageName}_${filenameWithoutExtension}`;
          },
      });
    });

    afterAll(() => {
      removeAdapter();
      endFileScope();
    });

    it('defers to a custom callback', () => {
      expect(generateIdentifier(`a`)).toMatchInlineSnapshot(
        `"abc_a_s0xkdr0_packagetest_file"`,
      );
    });

    it('rejects invalid identifiers', () => {
      // getIdentOption() does not remove spaces from the debug info so the
      // resulting identifier should be invalid here.
      expect(() => generateIdentifier(`a b`)).toThrow();
    });
  });
});
