import { compose } from './compose';

describe('compose', () => {
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
  ])('compose', ({ args, output }) => {
    expect(compose(...args)).toBe(output);
  });
});
