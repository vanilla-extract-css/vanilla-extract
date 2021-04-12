import {
  get,
  walkObject,
  Contract,
  MapLeafNodes,
} from '@vanilla-extract/private';
import { setElementVar } from './setElementVar';

export function setElementTheme<VarContract extends Contract>(
  element: HTMLElement,
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string>,
): void {
  walkObject(tokens, (value, path) => {
    setElementVar(element, get(varContract, path), String(value));
  });
}
