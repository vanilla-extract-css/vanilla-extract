import hash from '@emotion/hash';
import postcss from 'postcss';
// @ts-expect-error
import postcssJs from 'postcss-js';
import deepMerge from 'deepmerge';

type StyleRule = any;

type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends object
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};

type ThemeRef = string;

type ThemeRefs<ThemeContract> = MapLeafNodes<ThemeContract, ThemeRef>;

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

const walkObject = <T extends Walkable>(
  obj: T,
  fn: (value: Primitive, path: string) => string,
  path: Array<string> = [],
) => {
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

const appendRule = (className: string, rule: string) => {
  const css = `.${className} {
        ${rule}
    }`;

  styleSheet?.insertRule(css);
};

const style = <ThemeRef, Utils>(themeRefs: ThemeRef, utils: Utils) => (
  styleFn: (theme: ThemeRef, utils: Utils) => StyleRule,
) => {
  const styleValue = styleFn(themeRefs, utils);
  const styleRuleName = `_${hash(JSON.stringify(styleValue))}`;

  postcss()
    .process(styleValue, { parser: postcssJs, from: undefined })
    .then(({ css }) => {
      appendRule(styleRuleName, css);
    });

  return styleRuleName;
};

interface Theme<ThemeContract, Utils> {
  className: string;
  style: (theme: ThemeRefs<ThemeContract>, utils: Utils) => StyleRule;
  alternate: (theme: ThemeContract) => Theme<ThemeContract, Utils>;
}

const makeTheme = <ThemeContract extends Walkable, Utils>(baseTheme?: {
  theme: ThemeContract;
  themeHash: string;
  utils: Utils | undefined;
}) => (
  theme: ThemeContract,
  createUtils?: (themeRefs: ThemeRefs<ThemeContract>) => Utils,
): Theme<ThemeContract, Utils> => {
  // @ts-expect-error
  const finalTheme = deepMerge(baseTheme?.theme, theme);
  const finalThemeHash = hash(JSON.stringify(finalTheme));

  const cssVars: { [cssVarName: string]: Primitive } = {};
  const themeHash = baseTheme?.themeHash ?? finalThemeHash;

  const themeRefs: ThemeRefs<ThemeContract> = walkObject(
    finalTheme,
    (value, path) => {
      const cssVarName = `--${hash(themeHash + path)}`;

      cssVars[cssVarName] = value;

      return `var(${cssVarName})`;
    },
  );

  const utils =
    !baseTheme && createUtils ? createUtils(themeRefs) : baseTheme?.utils;

  const themeClassName = `_${finalThemeHash}`;

  postcss()
    .process(cssVars, { parser: postcssJs, from: undefined })
    .then(({ css }) => {
      appendRule(themeClassName, css);
    });

  return {
    className: themeClassName,
    style: style(themeRefs, utils),
    alternate: makeTheme({ theme: finalTheme, themeHash, utils }),
  };
};

export const createTheme = <ThemeContract extends Walkable, Utils>(
  theme: ThemeContract,
  createUtils?: (themeRefs: ThemeRefs<ThemeContract>) => Utils,
) => makeTheme()(theme, createUtils);
