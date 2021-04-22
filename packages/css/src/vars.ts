import {
  get,
  walkObject,
  Contract,
  MapLeafNodes,
} from '@vanilla-extract/private';
import hash from '@emotion/hash';
import cssesc from 'cssesc';

import { getAndIncrementRefCounter, getFileScope } from './fileScope';

type ThemeVars<ThemeContract extends Contract> = MapLeafNodes<
  ThemeContract,
  string
>;

export function createVar(debugId?: string) {
  // Convert ref count to base 36 for optimal hash lengths
  const refCount = getAndIncrementRefCounter();
  const { filePath, packageName } = getFileScope();
  const fileScopeHash = hash(
    packageName ? `${packageName}${filePath}` : filePath,
  );
  const varName =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${debugId}__${refCount}${fileScopeHash}`
      : `${refCount}${fileScopeHash}`;

  // Dashify CSS var names to replicate postcss-js behaviour
  // See https://github.com/postcss/postcss-js/blob/d5127d4278c133f333f1c66f990f3552a907128e/parser.js#L30
  const cssVarName = cssesc(varName.match(/^[0-9]/) ? `_${varName}` : varName, {
    isIdentifier: true,
  })
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();

  return `var(--${cssVarName})`;
}

export function fallbackVar(...values: [...Array<string>, string]) {
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

  return finalValue;
}

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

export function createThemeVars<ThemeContract extends Contract>(
  themeContract: ThemeContract,
): ThemeVars<ThemeContract> {
  return walkObject(themeContract, (_value, path) => {
    return createVar(path.join('-'));
  });
}
