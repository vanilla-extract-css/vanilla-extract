import type { Contract, MapLeafNodes } from '@vanilla-extract/private';
import type { GlobalStyleRule, Resolve, ThemeVars, Tokens } from './types';
import { appendCss, registerClassName } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import { createThemeContract, assignVars } from './vars';

type WithOptionalLayer<T extends Tokens> = T & {
  '@layer'?: string;
};

type WithoutLayer<T> = Omit<T, '@layer'>;

export function createGlobalTheme<ThemeTokens extends Tokens>(
  selector: string,
  tokens: WithOptionalLayer<ThemeTokens>,
): Resolve<WithoutLayer<ThemeVars<ThemeTokens>>>;
export function createGlobalTheme<ThemeContract extends Contract>(
  selector: string,
  themeContract: ThemeContract,
  tokens: WithOptionalLayer<MapLeafNodes<ThemeContract, string>>,
): void;
export function createGlobalTheme(
  selector: string,
  arg2: any,
  arg3?: any,
): any {
  const themeContractProvided = Boolean(arg3);

  const tokenArg = (
    themeContractProvided ? arg3 : arg2
  ) as WithOptionalLayer<Tokens>;

  const { layerName, tokens } = extractLayerFromTokens(tokenArg);

  const themeContract = themeContractProvided
    ? (arg2 as ThemeVars<any>)
    : createThemeContract(tokens);

  let rule: GlobalStyleRule = {
    vars: assignVars(themeContract, tokens),
  };

  if (layerName) {
    rule = {
      '@layer': {
        [layerName]: rule,
      },
    };
  }

  appendCss(
    {
      type: 'global',
      selector: selector,
      rule,
    },
    getFileScope(),
  );

  if (!themeContractProvided) {
    return themeContract;
  }
}

export function createTheme<ThemeContract extends Contract>(
  themeContract: ThemeContract,
  tokens: WithOptionalLayer<MapLeafNodes<ThemeContract, string>>,
  debugId?: string,
): string;
export function createTheme<ThemeTokens extends Tokens>(
  tokens: WithOptionalLayer<ThemeTokens>,
  debugId?: string,
): [className: string, vars: Resolve<WithoutLayer<ThemeVars<ThemeTokens>>>];
export function createTheme(arg1: any, arg2?: any, arg3?: string): any {
  const themeClassName = generateIdentifier(
    typeof arg2 === 'object' ? arg3 : arg2,
  );

  registerClassName(themeClassName, getFileScope());

  const vars =
    typeof arg2 === 'object'
      ? createGlobalTheme(themeClassName, arg1, arg2)
      : createGlobalTheme(themeClassName, arg1);

  return vars ? [themeClassName, vars] : themeClassName;
}

function extractLayerFromTokens(
  tokens: WithOptionalLayer<MapLeafNodes<any, string>>,
): {
  layerName?: string;
  tokens: MapLeafNodes<any, string>;
} {
  if ('@layer' in tokens) {
    const { '@layer': layerName, ...rest } = tokens;

    return { layerName, tokens: rest };
  }

  return { tokens };
}
