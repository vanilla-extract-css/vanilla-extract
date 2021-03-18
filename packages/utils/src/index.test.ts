import { calc, add, divide, multiply, subtract, negate } from './';

describe('utils', () => {
  describe('calc', () => {
    it('standard usage', () => {
      expect(calc('10px').add('20px').value).toMatchInlineSnapshot(
        `"calc(10px + 20px)"`,
      );
      expect(calc('10px').add('20px', '30px').value).toMatchInlineSnapshot(
        `"calc(10px + 20px + 30px)"`,
      );
      expect(calc('20px').subtract('10px').value).toMatchInlineSnapshot(
        `"calc(20px - 10px)"`,
      );
      expect(calc('20px').subtract('5px', '5px').value).toMatchInlineSnapshot(
        `"calc(20px - 5px - 5px)"`,
      );
      expect(calc('10px').multiply(10).value).toMatchInlineSnapshot(
        `"calc(10px * 10)"`,
      );
      expect(calc('10px').multiply(10, 2).value).toMatchInlineSnapshot(
        `"calc(10px * 10 * 2)"`,
      );
      expect(calc('10px').divide(10).value).toMatchInlineSnapshot(
        `"calc(10px / 10)"`,
      );
      expect(calc('10px').divide(10, 2).value).toMatchInlineSnapshot(
        `"calc(10px / 10 / 2)"`,
      );
      expect(calc('10px').add('20px').multiply(2).value).toMatchInlineSnapshot(
        `"calc((10px + 20px) * 2)"`,
      );
      expect(calc('10px').add('20px').divide(2).value).toMatchInlineSnapshot(
        `"calc((10px + 20px) / 2)"`,
      );
      expect(
        calc('20px').subtract('10px').negate().value,
      ).toMatchInlineSnapshot(`"calc((20px - 10px) * -1)"`);
      expect(
        calc('10px').multiply(100).divide(2).negate().value,
      ).toMatchInlineSnapshot(`"calc(((10px * 100) / 2) * -1)"`);
      expect(
        calc('10px')
          .add('50px')
          .subtract('20px')
          .multiply(100)
          .divide(2)
          .negate().value,
      ).toMatchInlineSnapshot(
        `"calc(((((10px + 50px) - 20px) * 100) / 2) * -1)"`,
      );
    });

    it('bailing early', () => {
      expect(calc('10px').value).toMatchInlineSnapshot(`"10px"`);
    });

    it('string coercion', () => {
      expect(calc('10px').toString()).toMatchInlineSnapshot(`"10px"`);
      expect(calc('10px').add('20px').toString()).toMatchInlineSnapshot(
        `"calc(10px + 20px)"`,
      );
      expect(`${calc('10px').add('20px')}`).toMatchInlineSnapshot(
        `"calc(10px + 20px)"`,
      );
    });
  });

  it('add', () => {
    expect(add(1, 2)).toMatchInlineSnapshot(`"calc(1 + 2)"`);
    expect(add(1, 2, 3)).toMatchInlineSnapshot(`"calc(1 + 2 + 3)"`);
    expect(add('1', 2, 3 - 4)).toMatchInlineSnapshot(`"calc(1 + 2 + -1)"`);
    expect(add('10px', '2em')).toMatchInlineSnapshot(`"calc(10px + 2em)"`);
    expect(add('10px', '2em', add('2', '6rem'))).toMatchInlineSnapshot(
      `"calc(10px + 2em + (2 + 6rem))"`,
    );
    expect(
      add(multiply(subtract('10px', '2em'), add('2', '6rem'), '4px')),
    ).toMatchInlineSnapshot(`"calc(((10px - 2em) * (2 + 6rem) * 4px))"`);
  });

  it('subtract', () => {
    expect(subtract(1, 2)).toMatchInlineSnapshot(`"calc(1 - 2)"`);
    expect(subtract(1, 2, 3)).toMatchInlineSnapshot(`"calc(1 - 2 - 3)"`);
    expect(subtract('1', 2, 3 - 4)).toMatchInlineSnapshot(`"calc(1 - 2 - -1)"`);
    expect(subtract('10px', '2em')).toMatchInlineSnapshot(`"calc(10px - 2em)"`);
    expect(subtract('10px', '2em', add('2', '6rem'))).toMatchInlineSnapshot(
      `"calc(10px - 2em - (2 + 6rem))"`,
    );
  });

  it('muliply', () => {
    expect(multiply(1, 2)).toMatchInlineSnapshot(`"calc(1 * 2)"`);
    expect(multiply(1, 2, 3)).toMatchInlineSnapshot(`"calc(1 * 2 * 3)"`);
    expect(multiply('1', 2, 3 - 4)).toMatchInlineSnapshot(`"calc(1 * 2 * -1)"`);
    expect(multiply('10px', '2em')).toMatchInlineSnapshot(`"calc(10px * 2em)"`);
    expect(multiply('10px', '2em', add('2', '6rem'))).toMatchInlineSnapshot(
      `"calc(10px * 2em * (2 + 6rem))"`,
    );
  });

  it('divide', () => {
    expect(divide(1, 2)).toMatchInlineSnapshot(`"calc(1 / 2)"`);
    expect(divide(1, 2, 3)).toMatchInlineSnapshot(`"calc(1 / 2 / 3)"`);
    expect(divide('1', 2, 3 - 4)).toMatchInlineSnapshot(`"calc(1 / 2 / -1)"`);
    expect(divide('10px', '2em')).toMatchInlineSnapshot(`"calc(10px / 2em)"`);
    expect(divide('10px', '2em', add('2', '6rem'))).toMatchInlineSnapshot(
      `"calc(10px / 2em / (2 + 6rem))"`,
    );
  });

  it('negate', () => {
    expect(negate(2)).toMatchInlineSnapshot(`"calc(2 * -1)"`);
    expect(negate(3 - 4)).toMatchInlineSnapshot(`"calc(-1 * -1)"`);
    expect(negate(add('10px', '2em'))).toMatchInlineSnapshot(
      `"calc((10px + 2em) * -1)"`,
    );
  });
});
