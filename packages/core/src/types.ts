import type { PropertiesFallback } from 'csstype';

import type { SimplePseudos } from './transformCSS';

type BasicCSSProperties = PropertiesFallback<string | number>;

export interface CSSKeyframes {
  [time: string]: BasicCSSProperties;
}

export type CSSProperties = BasicCSSProperties & {
  vars?: {
    [key: string]: string | number;
  };
  '@keyframes'?: CSSKeyframes | string;
};

type PseudoProperties = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = CSSProperties & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSProperties;
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

export interface CSS {
  selector: string;
  rule: StyleRule;
}

export interface Adapter {
  appendCss: (css: CSS, fileScope: string) => void;
  registerClassName: (className: string) => void;
  getRegisteredClassNames: () => Array<string>;
}
