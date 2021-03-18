type Operator = '+' | '-' | '*' | '/';
type Operand = string | number;

const toExpression = (operator: Operator, ...operands: Array<Operand>) =>
  operands.join(` ${operator} `).replace(/calc/g, '');

export const add = (...operands: Array<Operand>) =>
  `calc(${toExpression('+', ...operands)})`;

export const subtract = (...operands: Array<Operand>) =>
  `calc(${toExpression('-', ...operands)})`;

export const multiply = (...operands: Array<Operand>) =>
  `calc(${toExpression('*', ...operands)})`;

export const divide = (...operands: Array<Operand>) =>
  `calc(${toExpression('/', ...operands)})`;

export const negate = (x: Operand) => multiply(x, -1);

export const calc = (x: Operand) => {
  const chain = {
    add: (...operands: Array<Operand>) => calc(add(x, ...operands)),
    subtract: (...operands: Array<Operand>) => calc(subtract(x, ...operands)),
    multiply: (...operands: Array<Operand>) => calc(multiply(x, ...operands)),
    divide: (...operands: Array<Operand>) => calc(divide(x, ...operands)),
    negate: () => calc(negate(x)),
    value: x,
  };

  Object.defineProperty(chain, 'toString', {
    value: () => x,
    writable: false,
  });

  return chain;
};
