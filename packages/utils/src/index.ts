type Operator = '+' | '-' | '*' | '/';
type Operand = string | number | CalcChain;

const toExpression = (operator: Operator, ...operands: Array<Operand>) =>
  operands
    .map((o) => `${o}`)
    .join(` ${operator} `)
    .replace(/calc/g, '');

const add = (...operands: Array<Operand>) =>
  `calc(${toExpression('+', ...operands)})`;

const subtract = (...operands: Array<Operand>) =>
  `calc(${toExpression('-', ...operands)})`;

const multiply = (...operands: Array<Operand>) =>
  `calc(${toExpression('*', ...operands)})`;

const divide = (...operands: Array<Operand>) =>
  `calc(${toExpression('/', ...operands)})`;

const negate = (x: Operand) => multiply(x, -1);

type CalcChain = {
  add: (...operands: Array<Operand>) => CalcChain;
  subtract: (...operands: Array<Operand>) => CalcChain;
  multiply: (...operands: Array<Operand>) => CalcChain;
  divide: (...operands: Array<Operand>) => CalcChain;
  negate: () => CalcChain;
  toString: () => string;
};

interface Calc {
  (x: Operand): CalcChain;
  add: typeof add;
  subtract: typeof subtract;
  multiply: typeof multiply;
  divide: typeof divide;
  negate: typeof negate;
}

export const calc: Calc = Object.assign(
  (x: Operand): CalcChain => {
    return {
      add: (...operands) => calc(add(x, ...operands)),
      subtract: (...operands) => calc(subtract(x, ...operands)),
      multiply: (...operands) => calc(multiply(x, ...operands)),
      divide: (...operands) => calc(divide(x, ...operands)),
      negate: () => calc(negate(x)),
      toString: () => x.toString(),
    };
  },
  {
    add,
    subtract,
    multiply,
    divide,
    negate,
  },
);
