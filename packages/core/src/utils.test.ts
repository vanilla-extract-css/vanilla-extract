import { isEqual } from './utils';

describe('isEqual', () => {
  it.each([
    [{ a: true }, { a: true }, true],
    [{ a: true }, { a: false }, false],
    [{ a: true }, { b: true }, false],
    [{ a: true, b: [1, 2] }, { a: true, b: [1, 2] }, true],
    [{ a: true, b: [1, 2] }, { a: true, b: [1, 3] }, false],
    [{ a: true, b: [1, 2, 3] }, { a: true, b: [1, 2] }, false],
    [{ a: { b: { c: '1' } } }, { a: { b: { c: '1' } } }, true],
    [{ a: { b: { c: '1' } } }, { a: { b: { c: '2' } } }, false],
  ])('isEqual', (a, b, expected) => {
    expect(isEqual(a, b)).toBe(expected);
  });
});
