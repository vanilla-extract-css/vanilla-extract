import { CSSVarFunction } from '@vanilla-extract/private';

export function fallbackVar(
  ...values: [string, ...Array<string>]
): CSSVarFunction {
  let finalValue = '';

  values.reverse().forEach((value) => {
    if (finalValue === '') {
      finalValue = String(value);
    } else {
      if (typeof value !== 'string' || !/^var\(--.*\)$/.test(value)) {
        throw new Error(`Invalid variable name: ${value}`);
      }

      finalValue = value.replace(/\)$/, `, ${finalValue})`);
    }
  });

  return finalValue as CSSVarFunction;
}
