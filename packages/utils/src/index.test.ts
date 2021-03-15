import { add, divide, multiply, subtract, negate } from './';

describe('utils', () => {
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
