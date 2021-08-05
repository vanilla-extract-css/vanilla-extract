import type { MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';
import type { PropertiesFallback, AtRule, Properties } from 'csstype';

import type { SimplePseudos } from './simplePseudos';

type CSSTypeProperties = PropertiesFallback<number | (string & {})>;

export type CSSProperties = {
  [Property in keyof CSSTypeProperties]:
    | CSSTypeProperties[Property]
    | CSSVarFunction
    | Array<CSSVarFunction | Properties[Property]>;
};

export interface CSSKeyframes {
  [time: string]: CSSProperties;
}

export type CSSPropertiesWithVars = CSSProperties & {
  vars?: {
    [key: string]: string;
  };
};

type PseudoProperties = {
  [key in SimplePseudos]?: CSSPropertiesWithVars;
};

type CSSPropertiesAndPseudos = CSSPropertiesWithVars & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSPropertiesWithVars &
    MediaQueries<
      CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>
    > &
    FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;
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

export type GlobalStyleRule = CSSPropertiesWithVars &
  MediaQueries<CSSPropertiesWithVars & FeatureQueries<CSSPropertiesWithVars>> &
  FeatureQueries<CSSPropertiesWithVars & MediaQueries<CSSPropertiesWithVars>>;

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

export interface Composition {
  identifier: string;
  classList: string;
}
export interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string) => void;
  registerComposition: (composition: Composition) => void;
  markCompositionUsed: (identifier: string) => void;
  onEndFileScope: (fileScope: FileScope) => void;
}

export type NullableTokens = {
  [key: string]: string | NullableTokens | null;
};

export type Tokens = {
  [key: string]: string | Tokens;
};

export type ThemeVars<ThemeContract extends NullableTokens> = MapLeafNodes<
  ThemeContract,
  CSSVarFunction
>;
