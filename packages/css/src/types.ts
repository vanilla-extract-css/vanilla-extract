import type { Contract, MapLeafNodes } from '@vanilla-extract/private';
import type { PropertiesFallback, AtRule, Properties } from 'csstype';

import type { SimplePseudos } from './transformCss';

export type CSSVarFunction =
  | `var(--${string})`
  | `var(--${string}, ${string | number})`;

type CSSTypeProperties = PropertiesFallback<string | number>;

type BasicCSSProperties = {
  [Property in keyof CSSTypeProperties]:
    | CSSTypeProperties[Property]
    | CSSVarFunction
    | Array<CSSVarFunction | Properties[Property]>;
};

export interface CSSKeyframes {
  [time: string]: BasicCSSProperties;
}

export type CSSProperties = BasicCSSProperties & {
  vars?: {
    [key: string]: string;
  };
};

type PseudoProperties = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = CSSProperties & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSProperties &
    MediaQueries<CSSProperties & FeatureQueries<CSSProperties>> &
    FeatureQueries<CSSProperties & MediaQueries<CSSProperties>>;
}

export interface MediaQueries<StyleType> {
  '@media'?: {
    [query: string]: StyleType;
  };
}

export interface FeatureQueries<StyleType> {
  '@supports'?: {
    [query: string]: StyleType;
  };
}

export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type StyleRule = StyleWithSelectors &
  MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>> &
  FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>;

export type GlobalStyleRule = CSSProperties &
  MediaQueries<CSSProperties & FeatureQueries<CSSProperties>> &
  FeatureQueries<CSSProperties & MediaQueries<CSSProperties>>;

export type GlobalFontFaceRule = Omit<AtRule.FontFaceFallback, 'src'> &
  Required<Pick<AtRule.FontFaceFallback, 'src'>>;
export type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;

export type CSSStyleBlock = {
  type: 'local';
  selector: string;
  rule: StyleRule;
};

export type CSSFontFaceBlock = {
  type: 'fontFace';
  rule: GlobalFontFaceRule;
};

export type CSSKeyframesBlock = {
  type: 'keyframes';
  name: string;
  rule: CSSKeyframes;
};

export type CSSSelectorBlock = {
  type: 'selector' | 'global';
  selector: string;
  rule: GlobalStyleRule;
};

export type CSS =
  | CSSStyleBlock
  | CSSFontFaceBlock
  | CSSKeyframesBlock
  | CSSSelectorBlock;

export type FileScope = {
  packageName?: string;
  filePath: string;
};

export interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string) => void;
  onEndFileScope: (fileScope: FileScope) => void;
}

export type Tokens = {
  [key: string]: string | Tokens;
};

export type ThemeVars<ThemeContract extends Contract> = MapLeafNodes<
  ThemeContract,
  CSSVarFunction
>;
