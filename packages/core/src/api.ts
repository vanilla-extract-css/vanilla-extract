import hash from '@emotion/hash';
import get from 'lodash/get';

import type { StyleRule } from './types';
import { appendCss } from './adapter';
import { sanitiseIdent } from './utils';

type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};

let refCounter = 0;
const fileScopes = ['DEFAULT_FILE_SCOPE'];

export function setFileScope(newFileScope: string) {
  refCounter = 0;
  fileScopes.unshift(newFileScope);
}

export function endFileScope() {
  refCounter = 0;
  fileScopes.splice(0, 1);
}

function getFileScope() {
  return fileScopes[0];
}

const createFileScopeId = (debugId: string | undefined) => {
  if (process.env.NODE_ENV !== 'production' && debugId) {
    return `${debugId}__${hash(getFileScope())}${refCounter++}`;
  }

  return `${hash(getFileScope())}${refCounter++}`;
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
  // Dashify CSS var names to replicate postcss-js behaviour
  // See https://github.com/postcss/postcss-js/blob/d5127d4278c133f333f1c66f990f3552a907128e/parser.js#L30
  const cssVarName = sanitiseIdent(createFileScopeId(debugId))
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase();

  return `var(--${cssVarName})`;
}

export function style(rule: StyleRule, debugId?: string) {
  const styleRuleName = sanitiseIdent(createFileScopeId(debugId));

  appendCss({ selector: `.${styleRuleName}`, rule }, getFileScope());

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

  const varSetters: { [cssVarName: string]: string | number } = {};

  /* TODO 
    - validate new variables arn't set
    - validate arrays have the same length as contract
  */
  walkObject(tokens, (value, path) => {
    varSetters[get(themeVars, path)] = value;
  });

  appendCss({ selector, rule: { vars: varSetters } }, getFileScope());

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
  const themeClassName = sanitiseIdent(
    createFileScopeId(typeof arg2 === 'object' ? arg3 : arg2),
  );

  const vars =
    typeof arg2 === 'object'
      ? createGlobalTheme(`.${themeClassName}`, arg1, arg2)
      : createGlobalTheme(`.${themeClassName}`, arg1);

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
