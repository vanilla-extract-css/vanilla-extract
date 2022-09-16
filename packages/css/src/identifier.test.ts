import { setFileScope, endFileScope } from './entries/fileScope';
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
});
