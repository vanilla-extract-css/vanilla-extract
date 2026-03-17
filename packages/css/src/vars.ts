import type { AtRule } from 'csstype';

import {
  get,
  walkObject,
  type Contract,
  type MapLeafNodes,
  type CSSVarFunction,
} from '@vanilla-extract/private';
import cssesc from 'cssesc';

import type { Tokens, NullableTokens, ThemeVars } from './types';
import { validateContract } from './validateContract';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import type { PropertySyntax } from './types';
import { appendCss } from './adapter';

type VarDeclaration =
  | {
      syntax: '*';
      inherits: boolean;
      initialValue?: string;
    }
  | {
      syntax: Exclude<PropertySyntax, '*'> | Array<PropertySyntax>;
      inherits: boolean;
      initialValue: string;
    };

const buildPropertyRule = ({
  syntax,
  inherits,
  initialValue,
}: VarDeclaration): AtRule.Property => ({
  syntax: `"${Array.isArray(syntax) ? syntax.join(' | ') : syntax}"`,
  inherits: inherits ? 'true' : 'false',
  ...(initialValue != null ? { initialValue } : {}),
});

export function createVar(debugId?: string): CSSVarFunction;
export function createVar(
  declaration: VarDeclaration,
  debugId?: string,
): CSSVarFunction;
export function createVar(
  debugIdOrDeclaration?: string | VarDeclaration,
  debugId?: string,
): CSSVarFunction {
  const cssVarName = cssesc(
    generateIdentifier({
      debugId:
        typeof debugIdOrDeclaration === 'string'
          ? debugIdOrDeclaration
          : debugId,
      debugFileName: false,
    }),
    { isIdentifier: true },
  );

  if (debugIdOrDeclaration && typeof debugIdOrDeclaration === 'object') {
    appendCss(
      {
        type: 'property',
        name: `--${cssVarName}`,
        rule: buildPropertyRule(debugIdOrDeclaration),
      },
      getFileScope(),
    );
  }

  return `var(--${cssVarName})` as const;
}

export function createGlobalVar(name: string): CSSVarFunction;
export function createGlobalVar(
  name: string,
  declaration: VarDeclaration,
): CSSVarFunction;
export function createGlobalVar(
  name: string,
  declaration?: VarDeclaration,
): CSSVarFunction {
  if (declaration && typeof declaration === 'object') {
    appendCss(
      {
        type: 'property',
        name: `--${name}`,
        rule: buildPropertyRule(declaration),
      },
      getFileScope(),
    );
  }

  return `var(--${name})`;
}

export function assertVarName(
  value: unknown,
): asserts value is `var(--${string})` {
  if (typeof value !== 'string' || !/^var\(--.*\)$/.test(value)) {
    throw new Error(`Invalid variable name: ${value}`);
  }
}

export function fallbackVar(
  ...values: [string, ...Array<string>]
): CSSVarFunction {
  let finalValue = '';

  values.reverse().forEach((value) => {
    if (finalValue === '') {
      finalValue = String(value);
    } else {
      assertVarName(value);

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
      typeof rawVarName === 'string' ? rawVarName.replace(/^--/, '') : null;

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
