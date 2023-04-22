import {
  get,
  walkObject,
  Contract,
  MapLeafNodes,
  CSSVarFunction,
} from '@vanilla-extract/private';
import cssesc from 'cssesc';

import { Tokens, NullableTokens, ThemeVars } from './types';
import { validateContract } from './validateContract';
import { generateIdentifier } from './identifier';

export function createVar(debugId?: string): CSSVarFunction {
  const cssVarName = cssesc(
    generateIdentifier({
      debugId,
      debugFileName: false,
    }),
    { isIdentifier: true },
  );

  return `var(--${cssVarName})` as const;
}

export const createVar$ = createVar;

export function fallbackVar(
  ...values: [string, ...Array<string>]
): CSSVarFunction {
  let finalValue = '';

  values.reverse().forEach((value) => {
    if (finalValue === '') {
      finalValue = String(value);
    } else {
      if (typeof value !== 'string' || !/^var\(--.*\)$/.test(value)) {
        throw new Error(`Invalid variable name: ${value}`);
      }

      finalValue = value.replace(/\)$/, `, ${finalValue})`);
    }
  });

  return finalValue as CSSVarFunction;
}

export function assignVars<VarContract extends Contract>(
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string>,
): Record<CSSVarFunction, string> {
  const varSetters: { [cssVarName: string]: string } = {};
  const { valid, diffString } = validateContract(varContract, tokens);

  if (!valid) {
    throw new Error(`Tokens don't match contract.\n${diffString}`);
  }

  walkObject(tokens, (value, path) => {
    varSetters[get(varContract, path)] = String(value);
  });

  return varSetters;
}

export function createThemeContract<ThemeTokens extends NullableTokens>(
  tokens: ThemeTokens,
): ThemeVars<ThemeTokens> {
  return walkObject(tokens, (_value, path) => {
    return createVar(path.join('-'));
  });
}

export const createThemeContract$ = createThemeContract;

export function createGlobalThemeContract<ThemeTokens extends Tokens>(
  tokens: ThemeTokens,
): ThemeVars<ThemeTokens>;
export function createGlobalThemeContract<ThemeTokens extends NullableTokens>(
  tokens: ThemeTokens,
  mapFn: (value: string | null, path: Array<string>) => string,
): ThemeVars<ThemeTokens>;
export function createGlobalThemeContract(
  tokens: Tokens | NullableTokens,
  mapFn?: (value: string | null, path: Array<string>) => string,
) {
  return walkObject(tokens, (value, path) => {
    const rawVarName =
      typeof mapFn === 'function'
        ? mapFn(value as string | null, path)
        : (value as string);

    const varName =
      typeof rawVarName === 'string' ? rawVarName.replace(/^\-\-/, '') : null;

    if (
      typeof varName !== 'string' ||
      varName !== cssesc(varName, { isIdentifier: true })
    ) {
      throw new Error(
        `Invalid variable name for "${path.join('.')}": ${varName}`,
      );
    }

    return `var(--${varName})`;
  });
}

export const createGlobalThemeContract$ = createGlobalThemeContract;
