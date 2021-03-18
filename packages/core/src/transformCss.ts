import cssesc from 'cssesc';
import hash from '@emotion/hash';
import each from 'lodash/each';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import mapKeys from 'lodash/mapKeys';

import type {
  CSS,
  CSSProperties,
  FeatureQueries,
  MediaQueries,
  StyleRule,
  StyleWithSelectors,
} from './types';
import { validateSelector } from './validateSelector';

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

export type SimplePseudos = typeof simplePseudos;

const simplePseudoSet = new Set<string>(simplePseudos);
const specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

interface CSSRule {
  conditions?: Array<string>;
  selector: string;
  rule: CSSProperties;
}

class Stylesheet {
  rules: Array<CSSRule>;
  conditionalRules: Array<CSSRule>;
  localClassNameRegex: RegExp | null;

  constructor(localClassNames: Array<string>) {
    this.rules = [];
    this.conditionalRules = [];
    this.localClassNameRegex =
      localClassNames.length > 0
        ? RegExp(`(${localClassNames.join('|')})`, 'g')
        : null;
  }

  processCssObj(root: CSS) {
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
    const rule = this.transformVars(this.transformRuleKeyframes(cssRule.rule));
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

  transformVars({ vars, ...rest }: CSSProperties) {
    if (!vars) {
      return rest;
    }

    return {
      ...mapKeys(vars, (_value, key) => {
        const matches = key.match(/^var\((.*)\)$/);

        if (matches) {
          return matches[1];
        }

        return key;
      }),
      ...rest,
    };
  }

  transformRuleKeyframes(rule: CSSProperties) {
    let { '@keyframes': keyframes, animation, animationName, ...rest } = rule;

    if (!keyframes && !rule.animation && !rule.animationName) {
      return rest;
    }

    let keyframesRef = typeof keyframes === 'string' ? keyframes : '';

    if (keyframes && typeof keyframes !== 'string') {
      keyframesRef = cssesc(hash(JSON.stringify(keyframes)), {
        isIdentifier: true,
      });

      // Hoist keyframes to the top of the stylesheet
      this.rules.unshift({
        selector: `@keyframes ${keyframesRef}`,
        rule: keyframes,
      });
    }

    return {
      ...rest,
      animation:
        animation && typeof animation === 'string'
          ? // @ts-expect-error Why???????????
            animation.replace('@keyframes', keyframesRef)
          : animation,
      animationName: animationName ? undefined : keyframesRef,
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
    root: CSS,
    rule: StyleWithSelectors,
    conditions?: Array<string>,
  ) {
    each(rule.selectors, (selectorRule, selector) => {
      if (root.type === 'global') {
        throw new Error('Selectors are not allowed within globalStyle');
      }

      const transformedSelector = this.transformSelector(
        selector.replace(RegExp('&', 'g'), root.selector),
      );
      validateSelector(transformedSelector, root.selector);

      this.addRule({
        conditions,
        selector: transformedSelector,
        rule: selectorRule,
      });
    });
  }

  transformMedia(
    root: CSS,
    rules:
      | MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>>
      | undefined,
    parentConditions: Array<string> = [],
  ) {
    each(rules, (mediaRule, query) => {
      const conditions = [`@media ${query}`, ...parentConditions];

      this.addRule({
        conditions,
        selector: root.selector,
        rule: omit(mediaRule, specialKeys),
      });

      this.transformSimplePsuedos(root, mediaRule!, conditions);
      this.transformSelectors(root, mediaRule!, conditions);
      this.transformSupports(root, mediaRule!['@supports'], conditions);
    });
  }

  transformSupports(
    root: CSS,
    rules:
      | FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>
      | undefined,
    parentConditions: Array<string> = [],
  ) {
    each(rules, (supportsRule, query) => {
      const conditions = [`@supports ${query}`, ...parentConditions];

      this.addRule({
        conditions,
        selector: root.selector,
        rule: omit(supportsRule, specialKeys),
      });

      this.transformSimplePsuedos(root, supportsRule!, conditions);
      this.transformSelectors(root, supportsRule!, conditions);
      this.transformMedia(root, supportsRule!['@media'], conditions);
    });
  }

  transformSimplePsuedos(
    root: CSS,
    rule: StyleRule,
    conditions?: Array<string>,
  ) {
    for (const key of Object.keys(rule)) {
      // Process simple psuedos
      if (simplePseudoSet.has(key)) {
        if (root.type === 'global') {
          throw new Error('Simple pseudos are not valid in globalStyles');
        }

        this.addRule({
          conditions,
          selector: `${root.selector}${key}`,
          rule: rule[key as keyof typeof rule] as CSSProperties,
        });
      }
    }
  }

  toPostcssJs() {
    const styles: any = {};

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

  return stylesheet.toPostcssJs();
}
