import hash from '@emotion/hash';
import postcss from 'postcss';
// @ts-expect-error
import postcssJs from 'postcss-js';
import deepMerge from 'deepmerge';
import dedent from 'dedent';

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

type Primitive = string | number | boolean;
type WalkableValue = Primitive | WalkableObject | WalkableArray;
interface WalkableObject {
  [index: string]: WalkableValue;
  [index: number]: WalkableValue;
}
interface WalkableArray extends Array<WalkableValue> {}
type Walkable = WalkableObject | WalkableArray;

const styleEl = document.createElement('style');
document.head.appendChild(styleEl);
const styleSheet = styleEl.sheet;

const walkObject = <T extends Walkable, MapTo>(
  obj: T,
  fn: (value: Primitive, path: string) => MapTo,
  path: Array<string> = [],
): MapLeafNodes<T, MapTo> => {
  const clone = obj.constructor();

  for (let key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (typeof value === 'object') {
      clone[key] = value ? walkObject(value, fn, currentPath) : value;
    } else {
      clone[key] = fn(value, currentPath.join('-'));
    }
  }

  return clone;
};

const hashToClassName = (h: string) => (/^[0-9]/.test(h[0]) ? `_${h}` : h);

const appendCss = (selector: string, cssObj: any) => {
  postcss()
    .process(cssObj, { parser: postcssJs, from: undefined })
    .then(({ css }) => {
      const classDefinition = dedent`${selector} {
          ${css}
      }`;

      console.log(classDefinition);

      styleSheet?.insertRule(classDefinition);
    });
};

export function style(css: any) {
  const styleRuleName = hashToClassName(hash(JSON.stringify(css)));

  appendCss(`.${styleRuleName}`, css);

  return styleRuleName;
}

export function defineVars<VarContract extends Walkable>(
  varContract: VarContract,
) {
  const contractHash = hash(JSON.stringify(varContract));
  const rootVarsClassName = hashToClassName(contractHash);
  const cssVars: { [cssVarName: string]: Primitive } = {};

  const vars = walkObject(varContract, (value, path) => {
    const cssVarName = `--${hash(contractHash + path)}`;

    cssVars[cssVarName] = value;

    return `var(${cssVarName})`;
  });

  appendCss(`:root, .${rootVarsClassName}`, cssVars);

  return {
    className: rootVarsClassName,
    vars,
    alternate: <AltThemeContract extends PartialAlternateContract<VarContract>>(
      altVarContract: AltThemeContract,
    ) => {
      // @ts-expect-error // Revisit types here, maybe even library itself
      const mergedContract = deepMerge(varContract, altVarContract);
      const altContractHash = hash(JSON.stringify(mergedContract));
      const altVarsClassName = hashToClassName(altContractHash);
      const altCssVars: { [cssVarName: string]: Primitive } = {};

      /* TODO 
        - validate new variables arn't set
        - validate arrays have the same length as contract
      */
      walkObject(mergedContract, (value, path) => {
        const cssVarName = `--${hash(contractHash + path)}`;

        altCssVars[cssVarName] = value;
      });

      appendCss(`.${altVarsClassName}`, altCssVars);

      return altVarsClassName;
    },
  };
}
