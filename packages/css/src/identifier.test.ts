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
});
