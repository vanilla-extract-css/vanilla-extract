import type { MapLeafNodes, CSSVarFunction } from '@vanilla-extract/private';
import type { Properties, AtRule } from 'csstype';

import type { SimplePseudos } from './simplePseudos';

// csstype is yet to ship container property types as they are not in
// the output MDN spec files yet. Remove this once that's done.
interface ContainerProperties {
  container?: string;
  containerType?: 'size' | 'inline-size' | 'block-size' | (string & {});
  containerName?: string;
}

type CSSTypeProperties = Properties<number | (string & {})> &
  ContainerProperties;

export type CSSProperties = {
  [Property in keyof CSSTypeProperties]:
    | CSSTypeProperties[Property]
    | CSSVarFunction
    | Array<CSSVarFunction | CSSTypeProperties[Property]>;
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

export interface ContainerQueries<StyleType> {
  '@container'?: {
    [query: string]: StyleType;
  };
}

export type WithQueries<StyleType> = MediaQueries<
  StyleType &
    FeatureQueries<StyleType & ContainerQueries<StyleType>> &
    ContainerQueries<StyleType & FeatureQueries<StyleType>>
> &
  FeatureQueries<
    StyleType &
      MediaQueries<StyleType & ContainerQueries<StyleType>> &
      ContainerQueries<StyleType & MediaQueries<StyleType>>
  > &
  ContainerQueries<
    StyleType &
      StyleType &
      MediaQueries<StyleType & FeatureQueries<StyleType>> &
      FeatureQueries<StyleType & MediaQueries<StyleType>>
  >;

interface SelectorMap {
  [selector: string]: CSSPropertiesWithVars &
    WithQueries<CSSPropertiesWithVars>;
}

export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type StyleRule = StyleWithSelectors & WithQueries<StyleWithSelectors>;

export type GlobalStyleRule = CSSPropertiesWithVars &
  WithQueries<CSSPropertiesWithVars>;

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

type IdentOption = 'short' | 'debug';
export interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string) => void;
  registerComposition: (composition: Composition) => void;
  markCompositionUsed: (identifier: string) => void;
  onEndFileScope: (fileScope: FileScope) => void;
  getIdentOption: () => IdentOption;
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

export type ClassNames = string | Array<ClassNames>;

export type ComplexStyleRule = StyleRule | Array<StyleRule | ClassNames>;
