import {
  walkObject,
  get,
  getVarName,
  Contract,
  MapLeafNodes,
} from '@vanilla-extract/private';

type Styles = { [cssVarName: string]: string };

function isDefined(value : any) : boolean {
  return value !== null && value !== undefined;
}

export function assignInlineVars(vars: Record<string, string>): Styles;
export function assignInlineVars<ThemeContract extends Contract>(
  contract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
): Styles;
export function assignInlineVars(varsOrContract: any, tokens?: any) {
  const styles: Styles = {};

  if (typeof tokens === 'object') {
    const contract = varsOrContract;

    walkObject(tokens, (value, path) => {
      const varName = get(contract, path);
      if(!isDefined(value)) return;
      styles[getVarName(varName)] = String(value);
    });
  } else {
    const vars = varsOrContract;

    for (const varName in vars) {
      const value = vars[varName];
      if(!isDefined(value)) continue;      
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