import hash from '@emotion/hash';
import cssesc from 'cssesc';
import dedent from 'dedent';

import type {
  GlobalStyleRule,
  StyleRule,
  FontFaceRule,
  CSSKeyframes,
  MapLeafNodes,
  Tokens,
  Contract,
} from './types';
import { appendCss, registerClassName } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';
import { walkObject, get } from './utils';

function getShortFileName() {
  const fileScope = getFileScope();

  const matches = fileScope.match(/.*\/(.*)\..*\..*$/);

  if (matches && matches[1]) {
    return matches[1];
  }

  return '';
}

const generateIdentifier = (debugId: string | undefined) => {
  const refCount = getAndIncrementRefCounter();

  const identifier =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${getShortFileName()}_${debugId}__${hash(getFileScope())}${refCount}`
      : `${hash(getFileScope())}${refCount}`;

  return identifier.match(/^[0-9]/) ? `_${identifier}` : identifier;
};

export function createVar(debugId?: string) {
  const refCount = getAndIncrementRefCounter();
  const varName =
    process.env.NODE_ENV !== 'production' && debugId
      ? `${debugId}__${hash(getFileScope())}${refCount}`
      : `${hash(getFileScope())}${refCount}`;

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

export function style(rule: StyleRule, debugId?: string) {
  const className = generateIdentifier(debugId);

  registerClassName(className);
  appendCss({ type: 'local', selector: className, rule }, getFileScope());

  return className;
}

export function globalStyle(selector: string, rule: GlobalStyleRule) {
  appendCss({ type: 'global', selector, rule }, getFileScope());
}

export function fontFace(rule: FontFaceRule, debugId?: string) {
  const fontFamily = `"${cssesc(generateIdentifier(debugId), {
    quotes: 'double',
  })}"`;

  if ('fontFamily' in rule) {
    throw new Error(
      dedent`
        This function creates and returns a hashed font-family name, so the "fontFamily" property should not be provided.

        If you'd like to define a globally scoped custom font, you can use the "globalFontFace" function instead.
      `,
    );
  }

  appendCss(
    { type: 'fontFace', rule: { ...rule, fontFamily } },
    getFileScope(),
  );

  return fontFamily;
}

export function globalFontFace(fontFamily: string, rule: FontFaceRule) {
  appendCss(
    { type: 'fontFace', rule: { ...rule, fontFamily } },
    getFileScope(),
  );
}

export function keyframes(rule: CSSKeyframes, debugId?: string) {
  const name = cssesc(generateIdentifier(debugId), {
    isIdentifier: true,
  });

  appendCss({ type: 'keyframes', name, rule }, getFileScope());

  return name;
}

export function globalKeyframes(name: string, rule: CSSKeyframes) {
  appendCss({ type: 'keyframes', name, rule }, getFileScope());
}

export function mapToStyles<
  StyleMap extends Record<string | number, StyleRule>
>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;
export function mapToStyles<Data extends Record<string | number, unknown>>(
  data: Data,
  mapData: <Key extends keyof Data>(value: Data[Key], key: Key) => StyleRule,
  debugId?: string,
): Record<keyof Data, string>;
export function mapToStyles(...args: any[]) {
  if (typeof args[1] === 'function') {
    const data = args[0];
    const mapData = args[1];
    const debugId = args[2];

    const classMap: Record<string | number, string> = {};
    for (const key in data) {
      classMap[key] = style(
        mapData(data[key], key),
        debugId ? `${debugId}_${key}` : key,
      );
    }

    return classMap;
  }

  const styleMap = args[0];
  const debugId = args[1];

  const classMap: Record<string | number, string> = {};
  for (const key in styleMap) {
    classMap[key] = style(styleMap[key], debugId ? `${debugId}_${key}` : key);
  }

  return classMap;
}

type ThemeVars<ThemeContract extends Contract> = MapLeafNodes<
  ThemeContract,
  string
>;

export function createThemeVars<ThemeContract extends Contract>(
  themeContract: ThemeContract,
): ThemeVars<ThemeContract> {
  return walkObject(themeContract, (_value, path) => {
    return createVar(path.join('-'));
  });
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

export function createGlobalTheme<ThemeTokens extends Tokens>(
  selector: string,
  tokens: ThemeTokens,
): ThemeVars<ThemeTokens>;
export function createGlobalTheme<ThemeContract extends Contract>(
  selector: string,
  themeContract: ThemeContract,
  tokens: ThemeVars<ThemeContract>,
): void;
export function createGlobalTheme(
  selector: string,
  arg2: any,
  arg3?: any,
): any {
  const shouldCreateVars = Boolean(!arg3);

  const themeVars = shouldCreateVars
    ? createThemeVars(arg2)
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

export function createInlineTheme<ThemeContract extends Contract>(
  themeVars: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string>,
) {
  const styles: { [cssVarName: string]: string } = {};

  /* TODO 
    - validate new variables arn't set
    - validate arrays have the same length as contract
  */
  walkObject(tokens, (value, path) => {
    const varName = get(themeVars, path);

    styles[varName.substring(4, varName.length - 1)] = String(value);
  });

  Object.defineProperty(styles, 'toString', {
    value: function () {
      return Object.keys(this)
        .map((key) => `${key}:${this[key]}`)
        .join(';');
    },
    writable: false,
  });

  return styles;
}
