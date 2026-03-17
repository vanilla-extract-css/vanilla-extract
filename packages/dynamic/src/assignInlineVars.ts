import {
  walkObject,
  get,
  getVarName,
  type Contract,
  type MapLeafNodes,
} from '@vanilla-extract/private';

type Styles = { [cssVarName: string]: string };

export function assignInlineVars(
  vars: Record<string, string | undefined | null>,
): Styles;
export function assignInlineVars<ThemeContract extends Contract>(
  contract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
): Styles;
export function assignInlineVars(varsOrContract: any, tokens?: any) {
  const styles: Styles = {};

  if (typeof tokens === 'object') {
    const contract = varsOrContract;

    walkObject(tokens, (value, path) => {
      if (value == null) {
        return;
      }

      const varName = get(contract, path);

      styles[getVarName(varName)] = String(value);
    });
  } else {
    const vars = varsOrContract;

    for (const varName in vars) {
      const value = vars[varName];

      if (value == null) {
        continue;
      }

      styles[getVarName(varName)] = value;
    }
  }

  Object.defineProperty(styles, 'toString', {
    value: function () {
      return Object.keys(this)
        .map((key) => `${key}:${this[key]}`)
        .join(';');
    },
    writable: false,
  });

  return styles;
}
