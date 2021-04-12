import { getVarName } from '@vanilla-extract/private';

export function setElementVar(
  element: HTMLElement,
  variable: string,
  value: string,
) {
  element.style.setProperty(getVarName(variable), value);
}
