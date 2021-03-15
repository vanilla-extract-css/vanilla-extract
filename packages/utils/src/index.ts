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

export const negate = (v: Operand) => multiply(v, -1);
