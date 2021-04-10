import { Contract, MapLeafNodes } from './types';
import { get, walkObject } from './utils';

export function assignVars<VarContract extends Contract>(
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string>,
): Record<string, string> {
  const varSetters: { [cssVarName: string]: string } = {};

  /* TODO
  - validate new variables arn't set
  - validate arrays have the same length as contract
*/
  walkObject(tokens, (value, path) => {
    varSetters[get(varContract, path)] = String(value);
  });

  return varSetters;
}
