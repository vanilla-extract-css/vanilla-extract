import hash from '@emotion/hash';
import deepMerge from 'deepmerge';

import type { StyleRule } from './types';
import { appendCss } from './adapter';
import { sanitiseIdent } from './utils';

type PartialAlternateContract<T> = {
  [P in keyof T]?: T[P] extends Record<string | number, unknown>
    ? PartialAlternateContract<T[P]>
    : T[P];
};

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

const createFileScopeIdent = () => {
  return `${hash(fileScope)}_${refCounter++}`;
};

const walkObject = <T, MapTo>(
  obj: T,
  fn: (value: string | number, path: string) => MapTo,
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
      clone[key] = fn(value, currentPath.join('-'));
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

export function createVar() {
  const cssVarName = sanitiseIdent(createFileScopeIdent());

  return `var(--${cssVarName})`;
}

export function style(rule: StyleRule) {
  const styleRuleName = sanitiseIdent(createFileScopeIdent());

  appendCss({ selector: `.${styleRuleName}`, rule }, fileScope);

  return styleRuleName;
}

// export function createTokens<TokenContract>() {

// }

export function defineVars<VarContract>(varContract: VarContract) {
  const varContractHash = createFileScopeIdent();
  const rootVarsClassName = sanitiseIdent(varContractHash);
  const cssVars: { [cssVarName: string]: string | number } = {};

  const vars = walkObject(varContract, (value, path) => {
    const cssVarName = `--${hash(varContractHash + path)}`;

    cssVars[cssVarName] = value;

    return `var(${cssVarName})`;
  });

  appendCss(
    { selector: `:root, .${rootVarsClassName}`, rule: cssVars },
    fileScope,
  );

  return {
    className: rootVarsClassName,
    vars,
    alternate: <AltVarContract extends PartialAlternateContract<VarContract>>(
      altVarContract: AltVarContract,
    ) => {
      // @ts-expect-error // Revisit types here, maybe even library itself
      const mergedContract = deepMerge(varContract, altVarContract);
      const altVarContractHash = createFileScopeIdent();
      const altVarsClassName = sanitiseIdent(altVarContractHash);
      const altCssVars: { [cssVarName: string]: string | number } = {};

      /* TODO 
        - validate new variables arn't set
        - validate arrays have the same length as contract
      */
      walkObject(mergedContract, (value, path) => {
        const cssVarName = `--${hash(varContractHash + path)}`;

        altCssVars[cssVarName] = value;
      });

      appendCss(
        { selector: `.${altVarsClassName}`, rule: altCssVars },
        fileScope,
      );

      return altVarsClassName;
    },
  };
}
