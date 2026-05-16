import { describe, expect, it } from 'vitest';
import { nestingSelectorRegex } from './nestingSelectorRegex';

// Mirrors how `transformScope` uses the regex: every `&` outside a quoted
// string is substituted, while any `&` inside a single- or double-quoted
// attribute value is left untouched.
const substitute = (selector: string) =>
  selector.replace(nestingSelectorRegex, '.p');

// `String.raw` keeps backslashes literal, so each input below is exactly the
// selector string the regex receives at runtime.
const cases = [
  {
    input: String.raw`&:before, &:after`,
    expected: String.raw`.p:before, .p:after`,
  },
  {
    input: String.raw`&[title="this & that"], &:after`,
    expected: String.raw`.p[title="this & that"], .p:after`,
  },
  {
    input: String.raw`&[title="this '&' that"], &:after`,
    expected: String.raw`.p[title="this '&' that"], .p:after`,
  },
  {
    input: String.raw`&[title="this \"&\" that"], &:after`,
    expected: String.raw`.p[title="this \"&\" that"], .p:after`,
  },
  {
    input: String.raw`&[title="thi\s \\& that"], &:after`,
    expected: String.raw`.p[title="thi\s \\& that"], .p:after`,
  },
  {
    input: String.raw`&[title='this & that'], &:after`,
    expected: String.raw`.p[title='this & that'], .p:after`,
  },
  {
    input: String.raw`&[title='this "&" that'], &:after`,
    expected: String.raw`.p[title='this "&" that'], .p:after`,
  },
  {
    input: String.raw`&[title='this \'&\' that'], &:after`,
    expected: String.raw`.p[title='this \'&\' that'], .p:after`,
  },
  {
    input: String.raw`&[title='thi\s \\& that'], &:after`,
    expected: String.raw`.p[title='thi\s \\& that'], .p:after`,
  },
];

describe('nestingSelectorRegex', () => {
  it.each(cases)(
    'substitutes only unquoted `&`: $input',
    ({ input, expected }) => {
      expect(substitute(input)).toBe(expected);
    },
  );

  it('does not catastrophically backtrack on an unbalanced quote', () => {
    // An `&` preceded by an unterminated quote can never satisfy the
    // lookbehind. With the previous nested quantifier (`[^"']*`) this input
    // took exponential time; matching a single character keeps it linear.
    const adversarial = `"${'a'.repeat(100_000)}&`;
    expect(substitute(adversarial)).toBe(adversarial);
  }, 1000);
});
