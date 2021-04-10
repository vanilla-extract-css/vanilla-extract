import { Contract, MapLeafNodes } from './types';
import { get, walkObject } from './utils';
import { setElementVar } from './setElementVar';

export function assignElementVars<VarContract extends Contract>(
  element: HTMLElement,
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string>,
): void {
  walkObject(tokens, (value, path) => {
    setElementVar(element, get(varContract, path), String(value));
  });
}
