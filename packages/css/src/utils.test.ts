import { isEqual, dudupeAndJoinClassList } from './utils';

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

describe('dudupeAndJoinClassList', () => {
  it.each([
    { args: ['1'], output: '1' },
    { args: ['1 1'], output: '1' },
    { args: ['1 2 3'], output: '1 2 3' },
    { args: ['1', '2', '3'], output: '1 2 3' },
    { args: [['1', '2'], '3'], output: '1 2 3' },
    { args: [['1', ['2', '3']], '4'], output: '1 2 3 4' },
    {
      args: [['1', ['2', ['3', '4']]], ['5', '6'], '7'],
      output: '1 2 3 4 5 6 7',
    },
    { args: ['1', '1', '1'], output: '1' },
    {
      args: ['1', ['1', '2'], ['1', '2', '3'], ['1', '2', '3', '4']],
      output: '1 2 3 4',
    },
    { args: ['1 2 3', '2 3 4', '1 5'], output: '1 2 3 4 5' },
    { args: [' 1  2  3  2 ', ' 2  3  4 2 ', ' 1  5  1 '], output: '1 2 3 4 5' },
    { args: ['1', '', '2'], output: '1 2' },
  ])('composeStyles', ({ args, output }) => {
    expect(dudupeAndJoinClassList(args)).toBe(output);
  });
});
