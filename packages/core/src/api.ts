import hash from '@emotion/hash';
import get from 'lodash/get';
import cssesc from 'cssesc';
import dedent from 'dedent';

import type { GlobalStyleRule, StyleRule, FontFaceRule } from './types';
import { appendCss, registerClassName } from './adapter';
import { getAndIncrementRefCounter, getFileScope } from './fileScope';

type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};

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

const walkObject = <T, MapTo>(
  obj: T,
  fn: (value: string | number, path: Array<string>) => MapTo,
  path: Array<string> = [],
): MapLeafNodes<T, MapTo> => {
  // @ts-expect-error
  const clone = obj.constructor();

  for (let key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (typeof value === 'object') {
      clone[key] = value ? walkObject(value, fn, currentPath) : value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      clone[key] = fn(value, currentPath);
    } else {
      console.warn(
        `Skipping invalid key "${currentPath.join(
          '.',
        )}". Should be a string, number or object. Received: "${typeof value}"`,
      );
    }
  }

  return clone;
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

export function fallbackVar(...values: [...Array<string>, string | number]) {
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

type ThemeVars<ThemeContract> = MapLeafNodes<ThemeContract, string>;

export function createThemeVars<ThemeContract>(
  themeContract: ThemeContract,
): ThemeVars<ThemeContract> {
  return walkObject(themeContract, (_value, path) => {
    return createVar(path.join('-'));
  });
}

export function assignVars<VarContract>(
  varContract: VarContract,
  tokens: MapLeafNodes<VarContract, string | number>,
): Record<string, string | number> {
  const varSetters: { [cssVarName: string]: string | number } = {};

  /* TODO
    - validate new variables arn't set
    - validate arrays have the same length as contract
  */
  walkObject(tokens, (value, path) => {
    varSetters[get(varContract, path)] = value;
  });

  return varSetters;
}

export function createGlobalTheme<ThemeContract>(
  selector: string,
  tokens: ThemeContract,
): ThemeVars<ThemeContract>;
export function createGlobalTheme<ThemeContract>(
  selector: string,
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string | number>,
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

export function createTheme<ThemeContract>(
  tokens: ThemeContract,
  debugId?: string,
): [className: string, vars: ThemeVars<ThemeContract>];
export function createTheme<ThemeContract>(
  themeContract: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string | number>,
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

export function createInlineTheme<ThemeContract>(
  themeVars: ThemeContract,
  tokens: MapLeafNodes<ThemeContract, string | number>,
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
