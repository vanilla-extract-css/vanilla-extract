import { getVarName } from '@vanilla-extract/private';
import cssesc from 'cssesc';

import type {
  CSS,
  CSSStyleBlock,
  CSSKeyframesBlock,
  CSSPropertiesWithVars,
  FeatureQueries,
  MediaQueries,
  StyleRule,
  StyleWithSelectors,
  GlobalFontFaceRule,
  CSSSelectorBlock,
} from './types';
import { validateSelector } from './validateSelector';
import { forEach, omit, mapKeys, isEqual } from './utils';

const UNITLESS: Record<string, boolean> = {
  animationIterationCount: true,
  borderImage: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexShrink: true,
  fontWeight: true,
  gridArea: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnStart: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowStart: true,
  initialLetter: true,
  lineClamp: true,
  lineHeight: true,
  maxLines: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  WebkitLineClamp: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // svg properties
  fillOpacity: true,
  floodOpacity: true,
  maskBorder: true,
  maskBorderOutset: true,
  maskBorderSlice: true,
  maskBorderWidth: true,
  shapeImageThreshold: true,
  stopOpacity: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

export const simplePseudos = [
  ':-moz-any-link',
  ':-moz-full-screen',
  ':-moz-placeholder',
  ':-moz-read-only',
  ':-moz-read-write',
  ':-ms-fullscreen',
  ':-ms-input-placeholder',
  ':-webkit-any-link',
  ':-webkit-full-screen',
  '::-moz-placeholder',
  '::-moz-progress-bar',
  '::-moz-range-progress',
  '::-moz-range-thumb',
  '::-moz-range-track',
  '::-moz-selection',
  '::-ms-backdrop',
  '::-ms-browse',
  '::-ms-check',
  '::-ms-clear',
  '::-ms-fill',
  '::-ms-fill-lower',
  '::-ms-fill-upper',
  '::-ms-reveal',
  '::-ms-thumb',
  '::-ms-ticks-after',
  '::-ms-ticks-before',
  '::-ms-tooltip',
  '::-ms-track',
  '::-ms-value',
  '::-webkit-backdrop',
  '::-webkit-input-placeholder',
  '::-webkit-progress-bar',
  '::-webkit-progress-inner-value',
  '::-webkit-progress-value',
  '::-webkit-slider-runnable-track',
  '::-webkit-slider-thumb',
  '::after',
  '::backdrop',
  '::before',
  '::cue',
  '::first-letter',
  '::first-line',
  '::grammar-error',
  '::placeholder',
  '::selection',
  '::spelling-error',
  ':active',
  ':after',
  ':any-link',
  ':before',
  ':blank',
  ':checked',
  ':default',
  ':defined',
  ':disabled',
  ':empty',
  ':enabled',
  ':first',
  ':first-child',
  ':first-letter',
  ':first-line',
  ':first-of-type',
  ':focus',
  ':focus-visible',
  ':focus-within',
  ':fullscreen',
  ':hover',
  ':in-range',
  ':indeterminate',
  ':invalid',
  ':last-child',
  ':last-of-type',
  ':left',
  ':link',
  ':only-child',
  ':only-of-type',
  ':optional',
  ':out-of-range',
  ':placeholder-shown',
  ':read-only',
  ':read-write',
  ':required',
  ':right',
  ':root',
  ':scope',
  ':target',
  ':valid',
  ':visited',
] as const;

function dashify(str: string) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/^ms-/, '-ms-')
    .toLowerCase();
}

const DOUBLE_SPACE = '  ';

export type SimplePseudos = typeof simplePseudos;

const simplePseudoSet = new Set<string>(simplePseudos);
const specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

interface CSSRule {
  conditions?: Array<string>;
  selector: string;
  rule: CSSPropertiesWithVars;
}

class Stylesheet {
  rules: Array<CSSRule>;
  conditionalRules: Array<CSSRule>;
  fontFaceRules: Array<GlobalFontFaceRule>;
  keyframesRules: Array<CSSKeyframesBlock>;
  localClassNameRegex: RegExp | null;

  constructor(localClassNames: Array<string>) {
    this.rules = [];
    this.conditionalRules = [];
    this.fontFaceRules = [];
    this.keyframesRules = [];
    this.localClassNameRegex =
      localClassNames.length > 0
        ? RegExp(`(${localClassNames.join('|')})`, 'g')
        : null;
  }

  processCssObj(root: CSS) {
    if (root.type === 'fontFace') {
      this.fontFaceRules.push(root.rule);

      return;
    }
    if (root.type === 'keyframes') {
      this.keyframesRules.push(root);

      return;
    }

    // Add main styles
    const mainRule = omit(root.rule, specialKeys);
    this.addRule({
      selector: root.selector,
      rule: mainRule,
    });

    this.transformSimplePsuedos(root, root.rule);
    this.transformMedia(root, root.rule['@media']);
    this.transformSupports(root, root.rule['@supports']);
    this.transformSelectors(root, root.rule);
  }

  addRule(cssRule: CSSRule) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    const rule = this.transformVars(this.pixelifyProperties(cssRule.rule));
    const selector = this.transformSelector(cssRule.selector);

    if (cssRule.conditions) {
      this.conditionalRules.push({
        selector,
        rule,
        conditions: cssRule.conditions.sort(),
      });
    } else {
      this.rules.push({
        selector,
        rule,
      });
    }
  }

  pixelifyProperties(cssRule: CSSPropertiesWithVars) {
    forEach(cssRule, (value, key) => {
      if (
        typeof value === 'number' &&
        value !== 0 &&
        !UNITLESS[key as keyof CSSPropertiesWithVars]
      ) {
        // @ts-expect-error Any ideas?
        cssRule[key] = `${value}px`;
      }
    });

    return cssRule;
  }

  transformVars({ vars, ...rest }: CSSPropertiesWithVars) {
    if (!vars) {
      return rest;
    }

    return {
      ...mapKeys(vars, (_value, key) => getVarName(key)),
      ...rest,
    };
  }

  transformSelector(selector: string) {
    return this.localClassNameRegex
      ? selector.replace(this.localClassNameRegex, (_, className, index) => {
          if (index > 0 && selector[index - 1] === '.') {
            return className;
          }

          return `.${cssesc(className, { isIdentifier: true })}`;
        })
      : selector;
  }

  transformSelectors(
    root: CSSStyleBlock | CSSSelectorBlock,
    rule: StyleWithSelectors,
    conditions?: Array<string>,
  ) {
    forEach(rule.selectors, (selectorRule, selector) => {
      if (root.type !== 'local') {
        throw new Error(
          `Selectors are not allowed within ${
            root.type === 'global' ? '"globalStyle"' : '"selectors"'
          }`,
        );
      }

      const transformedSelector = this.transformSelector(
        selector.replace(RegExp('&', 'g'), root.selector),
      );
      validateSelector(transformedSelector, root.selector);

      this.addRule({
        conditions,
        selector: transformedSelector,
        rule: omit(selectorRule, specialKeys),
      });

      const selectorRoot: CSSSelectorBlock = {
        type: 'selector',
        selector: transformedSelector,
        rule: selectorRule,
      };

      this.transformSupports(
        selectorRoot,
        selectorRule!['@supports'],
        conditions,
      );
      this.transformMedia(selectorRoot, selectorRule!['@media'], conditions);
    });
  }

  transformMedia(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules:
      | MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>>
      | undefined,
    parentConditions: Array<string> = [],
  ) {
    forEach(rules, (mediaRule, query) => {
      const conditions = [`@media ${query}`, ...parentConditions];

      this.addRule({
        conditions,
        selector: root.selector,
        rule: omit(mediaRule, specialKeys),
      });

      if (root.type === 'local') {
        this.transformSimplePsuedos(root, mediaRule!, conditions);
        this.transformSelectors(root, mediaRule!, conditions);
      }

      this.transformSupports(root, mediaRule!['@supports'], conditions);
    });
  }

  transformSupports(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules:
      | FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>
      | undefined,
    parentConditions: Array<string> = [],
  ) {
    forEach(rules, (supportsRule, query) => {
      const conditions = [`@supports ${query}`, ...parentConditions];

      this.addRule({
        conditions,
        selector: root.selector,
        rule: omit(supportsRule, specialKeys),
      });

      if (root.type === 'local') {
        this.transformSimplePsuedos(root, supportsRule!, conditions);
        this.transformSelectors(root, supportsRule!, conditions);
      }
      this.transformMedia(root, supportsRule!['@media'], conditions);
    });
  }

  transformSimplePsuedos(
    root: CSSStyleBlock | CSSSelectorBlock,
    rule: StyleRule,
    conditions?: Array<string>,
  ) {
    for (const key of Object.keys(rule)) {
      // Process simple psuedos
      if (simplePseudoSet.has(key)) {
        if (root.type !== 'local') {
          throw new Error(
            `Simple pseudos are not valid in ${
              root.type === 'global' ? '"globalStyle"' : '"selectors"'
            }`,
          );
        }

        this.addRule({
          conditions,
          selector: `${root.selector}${key}`,
          rule: rule[key as keyof typeof rule] as CSSPropertiesWithVars,
        });
      }
    }
  }

  toPostcssJs() {
    const styles: any = {};

    if (this.fontFaceRules.length > 0) {
      styles['@font-face'] = this.fontFaceRules;
    }

    this.keyframesRules.forEach((rule) => {
      styles[`@keyframes ${rule.name}`] = rule.rule;
    });

    for (const rule of [...this.rules, ...this.conditionalRules]) {
      if (rule.conditions && isEqual(styles[rule.selector], rule.rule)) {
        // Ignore conditional rules if they are identical to a non-conditional rule
        continue;
      }

      if (Object.keys(rule.rule).length === 0) {
        // Ignore empty rules
        continue;
      }

      let styleNode = styles;

      for (const condition of rule.conditions || []) {
        if (!styleNode[condition]) {
          styleNode[condition] = {};
        }
        styleNode = styleNode[condition];
      }

      styleNode[rule.selector] = {
        ...styleNode[rule.selector],
        ...rule.rule,
      };
    }

    return styles;
  }

  toCss() {
    const styles = this.toPostcssJs();

    function walkCss(v: any, indent: string = '') {
      const rules: Array<string> = [];

      for (const key of Object.keys(v)) {
        const value = v[key];

        if (value && Array.isArray(value)) {
          rules.push(
            ...value.map((v) => walkCss({ [key]: v }, indent).join('\n')),
          );
        } else if (value && typeof value === 'object') {
          rules.push(
            `${indent}${key} {\n${walkCss(value, indent + DOUBLE_SPACE).join(
              '\n',
            )}\n${indent}}`,
          );
        } else {
          rules.push(
            `${indent}${key.startsWith('--') ? key : dashify(key)}: ${value};`,
          );
        }
      }

      return rules;
    }

    return walkCss(styles);
  }
}

interface TransformCSSParams {
  localClassNames: Array<string>;
  cssObjs: Array<CSS>;
}
export function transformCss({ localClassNames, cssObjs }: TransformCSSParams) {
  const stylesheet = new Stylesheet(localClassNames);

  for (const root of cssObjs) {
    stylesheet.processCssObj(root);
  }

  return stylesheet.toCss();
}
