import cssesc from 'cssesc';
import dedent from 'dedent';

import type {
  FontFaceRule,
  CSSKeyframes,
  StyleRule,
  GlobalStyleRule,
} from './types';
import { registerClassName, appendCss } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

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

export function styleVariants<
  StyleMap extends Record<string | number, StyleRule>
>(styleMap: StyleMap, debugId?: string): Record<keyof StyleMap, string>;
export function styleVariants<Data extends Record<string | number, unknown>>(
  data: Data,
  mapData: <Key extends keyof Data>(value: Data[Key], key: Key) => StyleRule,
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
