import hash from '@emotion/hash';
import get from 'lodash/get';

import type { StyleRule } from './types';
import { appendCss } from './adapter';
import { sanitiseIdent } from './utils';

type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends object
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};

let refCounter = 0;
let fileScope = 'DEFAULT_FILE_SCOPE';

export function setFileScope(newFileScope: string) {
  refCounter = 0;
  fileScope = newFileScope;
}

const createFileScopeId = (debugId?: string) => {
  if (process.env.NODE_ENV !== 'production' && debugId) {
    return `${debugId}__${hash(fileScope)}${refCounter++}`;
  }

  return `${hash(fileScope)}${refCounter++}`;
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
  const cssVarName = sanitiseIdent(createFileScopeId(debugId));

  return `var(--${cssVarName})`;
}

export function style(rule: StyleRule, debugId?: string) {
  const styleRuleName = sanitiseIdent(createFileScopeId(debugId));

  appendCss({ selector: `.${styleRuleName}`, rule }, fileScope);

  return styleRuleName;
}

type ThemeVars<ThemeContract> = MapLeafNodes<ThemeContract, string>;

export function createThemeVars<ThemeContract>(
  themeContract: ThemeContract,
): ThemeVars<ThemeContract> {
  return walkObject(themeContract, (_value, path) => {
    return createVar(path.join('-'));
  });
}

export function createGlobalTheme<ThemeContract>(
  selector: string,
  tokens: ThemeContract,
): ThemeVars<ThemeContract>;
export function createGlobalTheme<Tokens>(
  selector: string,
  themeContract: ThemeVars<Tokens>,
  tokens: Tokens,
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

  const varSetters: { [cssVarName: string]: string | number } = {};

  /* TODO 
    - validate new variables arn't set
    - validate arrays have the same length as contract
  */
  walkObject(tokens, (value, path) => {
    varSetters[get(themeVars, path)] = value;
  });

  appendCss({ selector, rule: { vars: varSetters } }, fileScope);

  if (shouldCreateVars) {
    return themeVars;
  }
}

export function createTheme<ThemeContract>(
  tokens: ThemeContract,
): [className: string, vars: ThemeVars<ThemeContract>];
export function createTheme<Tokens>(
  themeContract: ThemeVars<Tokens>,
  tokens: Tokens,
): string;
export function createTheme(arg1: any, arg2?: any): any {
  const themeClassName = sanitiseIdent(createFileScopeId());

  const vars = arg2
    ? createGlobalTheme(`.${themeClassName}`, arg1, arg2)
    : createGlobalTheme(`.${themeClassName}`, arg1);

  return vars ? [themeClassName, vars] : themeClassName;
}

export function createInlineTheme<Tokens>(
  themeVars: ThemeVars<Tokens>,
  tokens: Tokens,
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
