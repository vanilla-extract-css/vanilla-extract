import {
  get,
  walkObject,
  Contract,
  MapLeafNodes,
  CSSVarFunction,
} from '@vanilla-extract/private';
import hash from '@emotion/hash';
import cssesc from 'cssesc';

import { NullableTokens, ThemeVars } from './types';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';
import { validateContract } from './validateContract';

export function createVar(debugId?: string): CSSVarFunction {
  // Convert ref count to base 36 for optimal hash lengths
  const refCount = getAndIncrementRefCounter().toString(36);
  const { filePath, packageName } = getFileScope();
  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );
  const varName =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${debugId}__${fileScopeHash}${refCount}`
      : `${fileScopeHash}${refCount}`;

  const cssVarName = cssesc(varName.match(/^[0-9]/) ? `_${varName}` : varName, {
    isIdentifier: true,
  });

  return `var(--${cssVarName})` as const;
}

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

export type MapValue = string | null | undefined;
export type Mapper = (value: MapValue, path: Array<string>) => string;
const defaultMapper: Mapper = (value, path) => {
  if (typeof value !== 'string') {
    throw new Error(
      `To use the default map function with "createGlobalThemeContract", each property value must be a string. Property "${path.join(
        '.',
      )}"'s value is "${value}".`,
    );
  }
  return value;
};

export function createGlobalThemeContract<
  ThemeTokens extends NullableTokens,
>(
  tokens: ThemeTokens,
  map: Mapper = defaultMapper,
): ThemeVars<ThemeTokens> {
  return walkObject(tokens, (value, path) => {
    const varName = map(value as MapValue, path);
    if (typeof varName !== 'string') {
      throw new Error(
        `The map function used by "createGlobalThemeContract" must return a string and instead returned "${value}".`,
      );
    }
    const cssVarName = cssesc(
      varName.match(/^[0-9]/) ? `_${varName}` : varName,
      {
        isIdentifier: true,
      },
    );
    return `var(--${cssVarName})` as const;
  });
}
