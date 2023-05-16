import type { CSSVarFunction, MapLeafNodes } from '@vanilla-extract/private';
import type { AtRule, Properties } from 'csstype';

import type { SimplePseudos } from './simplePseudos';

// csstype is yet to ship container property types as they are not in
// the output MDN spec files yet. Remove this once that's done.
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries
interface ContainerProperties {
  container?: string;
  containerType?: 'size' | 'inline-size' | (string & {});
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

type Query<Key extends string, StyleType> = {
  [key in Key]?: {
    [query: string]: Omit<StyleType, Key>;
  };
};

export type MediaQueries<StyleType> = Query<'@media', StyleType>;
export type FeatureQueries<StyleType> = Query<'@supports', StyleType>;
export type ContainerQueries<StyleType> = Query<'@container', StyleType>;
export type Layers<StyleType> = Query<'@layer', StyleType>;

interface AllQueries<StyleType>
  extends MediaQueries<StyleType & AllQueries<StyleType>>,
    FeatureQueries<StyleType & AllQueries<StyleType>>,
    ContainerQueries<StyleType & AllQueries<StyleType>>,
    Layers<StyleType & AllQueries<StyleType>> {}

export type WithQueries<StyleType> = StyleType & AllQueries<StyleType>;

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

export type CSSLayerDeclaration = {
  type: 'layer';
  name: string;
};

export type CSSPropertyBlock = {
  type: 'property';
  name: string;
  rule: AtRule.Property
};

export type CSS =
  | CSSStyleBlock
  | CSSFontFaceBlock
  | CSSKeyframesBlock
  | CSSSelectorBlock
  | CSSLayerDeclaration
  | CSSPropertyBlock;

export type FileScope = {
  packageName?: string;
  filePath: string;
};

export interface Composition {
  identifier: string;
  classList: string;
}

type CustomIdentFunction = (params: {
  hash: string;
  filePath: string;
  debugId?: string;
  packageName?: string;
}) => string;

type IdentOption = 'short' | 'debug' | CustomIdentFunction;

export interface Adapter {
  appendCss: (css: CSS, fileScope: FileScope) => void;
  registerClassName: (className: string, fileScope: FileScope) => void;
  registerComposition: (composition: Composition, fileScope: FileScope) => void;
  markCompositionUsed: (identifier: string) => void;
  onBeginFileScope?: (fileScope: FileScope) => void;
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

export type PropertySyntax = 
    | '<length>'
    | '<number>' 
    | '<percentage>' 
    | '<length-percentage>' 
    | '<color>' 
    | '<image>' 
    | '<url>' 
    | '<integer>' 
    | '<angle>' 
    | '<time>' 
    | '<resolution>' 
    | '<transform-function>' 
    | '<custom-ident>' 
    | '<transform-list>' 
    | '*'
    // needs this to make TS suggestions work
    | (string & Record<never, never>);