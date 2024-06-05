/**
 * @file Defines a class for creating CSS calc() functions. This class allows
 * for chaining operations to build up a calc() function.
 * @author rowan-gud
 * @author michaeltaranto
 * @author markdalgleish

/**
 * An input to a calc function. Can be a number, string, or another Calc
 * instance.
 *
 * NOTE: Unlike a lot of other places in this library, numbers will not be
 * interpreted as pixel values since they can be used to represent unitless
 * values.
 */
type Operand = string | number | Calc;

class Calc {
  expressions: string[];

  constructor(
    exprs: Operand[],
    private readonly operator?: '+' | '-' | '*' | '/',
  ) {
    const isMultiplyDivide = operator === '*' || operator === '/';

    this.expressions = exprs.map((e) => {
      if (e instanceof Calc) {
        const childIsAddSub = e.operator === '+' || e.operator === '-';

        if (isMultiplyDivide && childIsAddSub) {
          return `(${e.build()})`;
        }

        return e.build();
      }

      return e.toString();
    });
  }

  /**
   * Add operands to the current Calc instance
   *
   * @param operands - The operands to add
   * @returns A new Calc instance with the added operands
   * @example
   * ```ts
   * const result = calc(1).add(3);
   *
   * expect(result.build()).toBe('1 + 3');
   * expect(result.toString()).toBe('calc(1 + 3)');
   * ```
   */
  public add(...operands: Operand[]): Calc {
    return new Calc([this, ...operands], '+');
  }

  /**
   * Subtract operands from the current Calc instance
   *
   * @param operands - The operands to subtract
   * @returns A new Calc instance with the subtracted operands
   * @example
   * ```ts
   * const result = calc(1).subtract(3);
   *
   * expect(result.build()).toBe('1 - 3');
   * expect(result.toString()).toBe('calc(1 - 3)');
   * ```
   */
  public subtract(...operands: Operand[]): Calc {
    return new Calc([this, ...operands], '-');
  }

  /**
   * Multiply operands with the current Calc instance. If any of the operands
   * are Calc instances with the operator '+' or '-', they will be wrapped in
   * parentheses.
   *
   * @param operands - The operands to multiply
   * @returns A new Calc instance with the multiplied operands
   * @example
   * ```ts
   * const result = calc(1).multiply(3);
   *
   * expect(result.build()).toBe('1 * 3');
   * expect(result.toString()).toBe('calc(1 * 3)');
   *
   * const result2 = calc(1).add(2, 3).multiply(4);
   *
   * expect(result2.build()).toBe('(1 + 2 + 3) * 4');
   * expect(result2.toString()).toBe('calc((1 + 2 + 3) * 4)');
   * ```
   */
  public multiply(...operands: Operand[]): Calc {
    return new Calc([this, ...operands], '*');
  }

  /**
   * Divide the current Calc instance by the operands. If any of the operands
   * are Calc instances with the operator '+' or '-', they will be wrapped in
   * parentheses.
   *
   * @param operands - The operands to divide by
   * @returns A new Calc instance with the divided operands
   * @example
   * ```ts
   * const result = calc(1).divide(2);
   *
   * expect(result.build()).toBe('1 / 2');
   * expect(result.toString()).toBe('calc(1 / 2)');
   * ```
   */
  public divide(...operands: Operand[]): Calc {
    return new Calc([this, ...operands], '/');
  }

  /**
   * Negate the current Calc instance. If the current Calc instance has the
   * operator '+' or '-', it will be wrapped in parentheses.
   *
   * @returns A new Calc instance with the negated value
   * @example
   * ```ts
   * const result = calc(1).negate();
   *
   * expect(result.build()).toBe('1 * -1');
   * expect(result.toString()).toBe('calc(1 * -1)');
   *
   * const result2 = calc(1).add(3).negate();
   *
   * expect(result2.build()).toBe('(1 + 3) * -1');
   * expect(result2.toString()).toBe('calc((1 + 3) * -1)');
   * ```
   */
  public negate(): Calc {
    return new Calc([this, -1], '*');
  }

  /**
   * Build the current Calc instance into a CSS calc() function
   *
   * @returns The CSS calc() function
   * @example
   * ```ts
   * const result = calc(1).add(3);
   *
   * expect(result.toString()).toBe('calc(1 + 3)');
   * ```
   */
  public toString(): string {
    return `calc(${this.build()})`;
  }

  /**
   * Convert the current Calc instance to a string
   *
   * NOTE: This is not the same as calling build(). The resulting string will
   * not be wrapped in a calc() function
   *
   * @returns The string representation of the Calc instance
   * @example
   * ```ts
   * const result = calc(1).add(3);
   *
   * expect(result.build()).toBe('1 + 3');
   * ```
   */
  public build(): string {
    if (this.operator === undefined) {
      return this.expressions[0] ?? '';
    }

    return this.expressions.join(` ${this.operator} `);
  }
}

/**
 * Create a new Calc instance with the given operand
 *
 * @param x - The operand to create the Calc instance with
 * @returns A new Calc instance
 * @example
 * ```ts
 * const headerHeight = createVar()
 *
 * const root = style({
 *  height: calc(headerHeight)
 *    .divide(2)
 *    .build(),
 * })
 * ```
 */
export function calc(x: Operand): Calc {
  return new Calc([x]);
}
