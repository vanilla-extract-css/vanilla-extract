import {
  walkObject,
  get,
  getVarName,
  Contract,
  MapLeafNodes,
} from '@vanilla-extract/private';

type Styles = { [cssVarName: string]: string };

export function assignInlineVars(vars: Record<string, string>): Styles;
export function assignInlineVars<ThemeContract extends Contract>(
  contract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
): Styles;
export function assignInlineVars(varsOrContract: any, tokens?: any) {
  const styles: { [cssVarName: string]: string } = {};

  if (typeof tokens === 'object') {
    const contract = varsOrContract;

    walkObject(tokens, (value, path) => {
      const varName = get(contract, path);

      styles[varName.substring(4, varName.length - 1)] = String(value);
    });
  } else {
    const vars = varsOrContract;

    for (const varName in vars) {
      styles[getVarName(varName)] = vars[varName];
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
