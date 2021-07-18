import type { Contract, MapLeafNodes } from '@vanilla-extract/private';
import type { ThemeVars, Tokens } from './types';
import { appendCss, registerClassName } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import { createThemeContract, assignVars } from './vars';

export function createGlobalTheme<ThemeTokens extends Tokens>(
  selector: string,
  tokens: ThemeTokens,
): ThemeVars<ThemeTokens>;
export function createGlobalTheme<ThemeContract extends Contract>(
  selector: string,
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
): void;
export function createGlobalTheme(
  selector: string,
  arg2: any,
  arg3?: any,
): any {
  const shouldCreateVars = Boolean(!arg3);

  const themeVars = shouldCreateVars
    ? createThemeContract(arg2)
    : (arg2 as ThemeVars<any>);

  const tokens = shouldCreateVars ? arg2 : arg3;

  appendCss(
    {
      type: 'global',
      selector: selector,
      rule: { vars: assignVars(themeVars, tokens) },
    },
    getFileScope(),
  );

  if (shouldCreateVars) {
    return themeVars;
  }
}

export function createTheme<ThemeTokens extends Tokens>(
  tokens: ThemeTokens,
  debugId?: string,
): [className: string, vars: ThemeVars<ThemeTokens>];
export function createTheme<ThemeContract extends Contract>(
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
  debugId?: string,
): string;
export function createTheme(arg1: any, arg2?: any, arg3?: string): any {
  const themeClassName = generateIdentifier(
    typeof arg2 === 'object' ? arg3 : arg2,
  );

  registerClassName(themeClassName);

  const vars =
    typeof arg2 === 'object'
      ? createGlobalTheme(themeClassName, arg1, arg2)
      : createGlobalTheme(themeClassName, arg1);

  return vars ? [themeClassName, vars] : themeClassName;
}
