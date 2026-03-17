import {
  get,
  walkObject,
  getVarName,
  type Contract,
  type MapLeafNodes,
} from '@vanilla-extract/private';

function setVar(element: HTMLElement, variable: string, value: string) {
  element.style.setProperty(getVarName(variable), value);
}

export function setElementVars(
  element: HTMLElement,
  vars: Record<string, string | undefined | null>,
): void;
export function setElementVars<ThemeContract extends Contract>(
  element: HTMLElement,
  contract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
): void;
export function setElementVars(
  element: HTMLElement,
  varsOrContract: any,
  tokens?: any,
): void {
  if (typeof tokens === 'object') {
    const contract = varsOrContract;

    walkObject(tokens, (value, path) => {
      if (value == null) {
        return;
      }

      setVar(element, get(contract, path), String(value));
    });
  } else {
    const vars = varsOrContract;

    for (const varName in vars) {
      const value = vars[varName];

      if (value == null) {
        continue;
      }

      setVar(element, varName, vars[varName]);
    }
  }
}
