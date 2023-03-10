import cssesc from 'cssesc';
import outdent from 'outdent';
import deepmerge from 'deepmerge';

import type {
  FontFaceRule,
  CSSKeyframes,
  StyleRule,
  GlobalStyleRule,
  ClassNames,
  ComplexStyleRule,
} from './types';
import {
  registerClassName,
  appendCss,
  registerComposition,
  markCompositionUsed,
} from './adapter';
import { getFileScope, hasFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import { dudupeAndJoinClassList } from './utils';

function composedStyle(rules: Array<StyleRule | ClassNames>, debugId?: string) {
  const className = generateIdentifier(debugId);
  registerClassName(className, getFileScope());

  const classList = [];
  const styleRules = [];

  for (const rule of rules) {
    if (typeof rule === 'string') {
      classList.push(rule);
    } else {
      styleRules.push(rule);
    }
  }

  let result = className;

  if (classList.length > 0) {
    result = `${className} ${dudupeAndJoinClassList(classList)}`;

    registerComposition(
      {
        identifier: className,
        classList: result,
      },
      getFileScope(),
    );

    if (styleRules.length > 0) {
      // If there are styles attached to this composition then it is
      // always used and should never be removed
      markCompositionUsed(className);
    }
  }

  if (styleRules.length > 0) {
    const rule = deepmerge.all(styleRules, {
      // Replace arrays rather than merging
      arrayMerge: (_, sourceArray) => sourceArray,
    });

    appendCss({ type: 'local', selector: className, rule }, getFileScope());
  }

  return result;
}

export function style(rule: ComplexStyleRule, debugId?: string) {
  if (Array.isArray(rule)) {
    return composedStyle(rule, debugId);
  }

  const className = generateIdentifier(debugId);

  registerClassName(className, getFileScope());
  appendCss({ type: 'local', selector: className, rule }, getFileScope());

  return className;
}

/**
 * @deprecated The same functionality is now provided by the 'style' function when you pass it an array
 */
export function composeStyles(...classNames: Array<ClassNames>) {
  const compose = hasFileScope() ? composedStyle : dudupeAndJoinClassList;

  return compose(classNames);
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
      outdent`
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

export function styleVariants<
  StyleMap extends Record<string | number, ComplexStyleRule>,
>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;
export function styleVariants<
  Data extends Record<string | number, unknown>,
  Key extends keyof Data,
>(
  data: Data,
  mapData: (value: Data[Key], key: Key) => ComplexStyleRule,
  debugId?: string,
): Record<keyof Data, string>;
export function styleVariants(...args: any[]) {
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
