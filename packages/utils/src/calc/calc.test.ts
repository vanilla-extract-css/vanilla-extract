import { calc } from './calc';

const css = 'var(--some-css-var)';

describe('class UnitCalc', () => {
  describe('add()', () => {
    it.each`
      args                     | expectedExpressions | expectedBuilt
      ${[]}                    | ${['1']}            | ${'calc(1)'}
      ${[2]}                   | ${['1', '2']}       | ${'calc(1 + 2)'}
      ${[2, '3']}              | ${['1', '2', '3']}  | ${'calc(1 + 2 + 3)'}
      ${[calc(2)]}             | ${['1', '2']}       | ${'calc(1 + 2)'}
      ${[calc(2).add(3)]}      | ${['1', '2 + 3']}   | ${'calc(1 + 2 + 3)'}
      ${[calc(2).subtract(3)]} | ${['1', '2 - 3']}   | ${'calc(1 + 2 - 3)'}
      ${[calc(2).multiply(3)]} | ${['1', '2 * 3']}   | ${'calc(1 + 2 * 3)'}
      ${[calc(2).divide(3)]}   | ${['1', '2 / 3']}   | ${'calc(1 + 2 / 3)'}
      ${[css]}                 | ${['1', css]}       | ${'calc(1 + var(--some-css-var))'}
    `(
      'should add $args to 1 to get $expectedBuilt',
      ({ args, expectedExpressions, expectedBuilt }) => {
        const result = calc(1).add(...args);

        expect(result).toMatchObject({
          expressions: expectedExpressions,
          operator: '+',
        });
        expect(result.toString()).toBe(expectedBuilt);
      },
    );
  });

  describe('subtract()', () => {
    it.each`
      args                     | expectedExpressions | expectedBuilt
      ${[]}                    | ${['1']}            | ${'calc(1)'}
      ${[2]}                   | ${['1', '2']}       | ${'calc(1 - 2)'}
      ${[2, '3']}              | ${['1', '2', '3']}  | ${'calc(1 - 2 - 3)'}
      ${[calc(2)]}             | ${['1', '2']}       | ${'calc(1 - 2)'}
      ${[calc(2).add(3)]}      | ${['1', '2 + 3']}   | ${'calc(1 - 2 + 3)'}
      ${[calc(2).subtract(3)]} | ${['1', '2 - 3']}   | ${'calc(1 - 2 - 3)'}
      ${[calc(2).multiply(3)]} | ${['1', '2 * 3']}   | ${'calc(1 - 2 * 3)'}
      ${[calc(2).divide(3)]}   | ${['1', '2 / 3']}   | ${'calc(1 - 2 / 3)'}
      ${[css]}                 | ${['1', css]}       | ${'calc(1 - var(--some-css-var))'}
    `(
      'should subtract $args from 1 to get $expectedBuilt',
      ({ args, expectedExpressions, expectedBuilt }) => {
        const result = calc(1).subtract(...args);

        expect(result).toMatchObject({
          expressions: expectedExpressions,
          operator: '-',
        });
        expect(result.toString()).toBe(expectedBuilt);
      },
    );
  });

  describe('multiply()', () => {
    it.each`
      args                     | expectedExpressions | expectedBuilt
      ${[]}                    | ${['1']}            | ${'calc(1)'}
      ${[2]}                   | ${['1', '2']}       | ${'calc(1 * 2)'}
      ${[2, '3']}              | ${['1', '2', '3']}  | ${'calc(1 * 2 * 3)'}
      ${[calc(2)]}             | ${['1', '2']}       | ${'calc(1 * 2)'}
      ${[calc(2).add(3)]}      | ${['1', '(2 + 3)']} | ${'calc(1 * (2 + 3))'}
      ${[calc(2).subtract(3)]} | ${['1', '(2 - 3)']} | ${'calc(1 * (2 - 3))'}
      ${[calc(2).multiply(3)]} | ${['1', '2 * 3']}   | ${'calc(1 * 2 * 3)'}
      ${[calc(2).divide(3)]}   | ${['1', '2 / 3']}   | ${'calc(1 * 2 / 3)'}
      ${[css]}                 | ${['1', css]}       | ${'calc(1 * var(--some-css-var))'}
    `(
      'should multiply 1 by $args to get $expectedBuilt',
      ({ args, expectedExpressions, expectedBuilt }) => {
        const result = calc(1).multiply(...args);

        expect(result).toMatchObject({
          expressions: expectedExpressions,
          operator: '*',
        });
        expect(result.toString()).toBe(expectedBuilt);
      },
    );
  });

  describe('divide()', () => {
    it.each`
      args                     | expectedExpressions | expectedBuilt
      ${[]}                    | ${['1']}            | ${'calc(1)'}
      ${[2]}                   | ${['1', '2']}       | ${'calc(1 / 2)'}
      ${[2, '3']}              | ${['1', '2', '3']}  | ${'calc(1 / 2 / 3)'}
      ${[calc(2)]}             | ${['1', '2']}       | ${'calc(1 / 2)'}
      ${[calc(2).add(3)]}      | ${['1', '(2 + 3)']} | ${'calc(1 / (2 + 3))'}
      ${[calc(2).subtract(3)]} | ${['1', '(2 - 3)']} | ${'calc(1 / (2 - 3))'}
      ${[calc(2).multiply(3)]} | ${['1', '2 * 3']}   | ${'calc(1 / 2 * 3)'}
      ${[calc(2).divide(3)]}   | ${['1', '2 / 3']}   | ${'calc(1 / 2 / 3)'}
      ${[css]}                 | ${['1', css]}       | ${'calc(1 / var(--some-css-var))'}
    `(
      'should divide 1 by $args to get $expectedBuilt',
      ({ args, expectedExpressions, expectedBuilt }) => {
        const result = calc(1).divide(...args);

        expect(result).toMatchObject({
          expressions: expectedExpressions,
          operator: '/',
        });
        expect(result.toString()).toBe(expectedBuilt);
      },
    );
  });

  describe('negate()', () => {
    it.each`
      calc                   | expectedExpressions  | expectedBuilt
      ${calc(1)}             | ${['-1', '1']}       | ${'calc(-1 * 1)'}
      ${calc(1).add(3)}      | ${['-1', '(1 + 3)']} | ${'calc(-1 * (1 + 3))'}
      ${calc(1).subtract(3)} | ${['-1', '(1 - 3)']} | ${'calc(-1 * (1 - 3))'}
      ${calc(1).multiply(3)} | ${['-1', '1 * 3']}   | ${'calc(-1 * 1 * 3)'}
      ${calc(1).divide(3)}   | ${['-1', '1 / 3']}   | ${'calc(-1 * 1 / 3)'}
      ${calc(css)}           | ${['-1', css]}       | ${'calc(-1 * var(--some-css-var))'}
    `(
      'should negate $calc to get $expectedBuilt',
      ({ calc, expectedExpressions, expectedBuilt }) => {
        const result = calc.negate();

        expect(result).toMatchObject({
          expressions: expectedExpressions,
          operator: '*',
        });
        expect(result.toString()).toBe(expectedBuilt);
      },
    );
  });

  describe('toString()', () => {
    it.each`
      calc                   | expected
      ${calc(1)}             | ${'calc(1)'}
      ${calc(1).add(3)}      | ${'calc(1 + 3)'}
      ${calc(1).subtract(3)} | ${'calc(1 - 3)'}
      ${calc(1).multiply(3)} | ${'calc(1 * 3)'}
      ${calc(1).divide(3)}   | ${'calc(1 / 3)'}
      ${calc(1).negate()}    | ${'calc(-1 * 1)'}
    `('should build $calc to get $expected', ({ calc, expected }) => {
      expect(calc.toString()).toBe(expected);
    });
  });

  describe('build()', () => {
    it.each`
      calc                   | expected
      ${calc(1)}             | ${'1'}
      ${calc(1).add(3)}      | ${'1 + 3'}
      ${calc(1).subtract(3)} | ${'1 - 3'}
      ${calc(1).multiply(3)} | ${'1 * 3'}
      ${calc(1).divide(3)}   | ${'1 / 3'}
    `('should convert $calc to string $expected', ({ calc, expected }) => {
      expect(calc.build()).toBe(expected);
    });
  });
});
