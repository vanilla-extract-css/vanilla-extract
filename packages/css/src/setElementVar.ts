import { getVarName } from './getVarName';

export const setElementVar = (
  element: HTMLElement,
  variable: string,
  value: string,
) => {
  element.style.setProperty(getVarName(variable), value);
};
