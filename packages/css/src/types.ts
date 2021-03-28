import type { PropertiesFallback, AtRule } from 'csstype';

import type { SimplePseudos } from './transformCss';

type BasicCSSProperties = PropertiesFallback<string | number>;

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

export interface Adapter {
  appendCss: (css: CSS, fileScope: string) => void;
  registerClassName: (className: string) => void;
  onEndFileScope: (fileScope: string) => void;
}

export type Contract = {
  [key: string]: string | null | Contract;
};

export type Tokens = {
  [key: string]: string | Tokens;
};

export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};

export type ThemeVars<ThemeContract extends Contract> = MapLeafNodes<
  ThemeContract,
  string
>;
