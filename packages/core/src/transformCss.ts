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
  StyleWithSelectors,
} from './types';
import { sanitiseIdent } from './utils';
import { validateSelector } from './validateSelector';
import { getRegisteredClassNames } from './adapter';

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

interface CSSRule {
  conditions?: Array<string>;
  selector: string;
  rule: CSSProperties;
}

class Stylesheet {
  rules: Array<CSSRule>;
  conditionalRules: Array<CSSRule>;

  constructor() {
    this.rules = [];
    this.conditionalRules = [];
  }

  addRule(cssRule: CSSRule) {
    const rule = this.processVars(this.processRuleKeyframes(cssRule.rule));
    const interpolatedSelector = interpolateLocalClassNames(cssRule.selector);

    if (cssRule.conditions) {
      this.conditionalRules.push({
        selector: interpolatedSelector,
        rule,
        conditions: cssRule.conditions.sort(),
      });
    } else {
      this.rules.push({
        selector: interpolatedSelector,
        rule,
      });
    }
  }

  processVars({ vars, ...rest }: CSSProperties) {
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

  processRuleKeyframes(rule: CSSProperties) {
    let { '@keyframes': keyframes, animation, animationName, ...rest } = rule;

    if (!keyframes && !rule.animation && !rule.animationName) {
      return rest;
    }

    let keyframesRef = typeof keyframes === 'string' ? keyframes : '';

    if (keyframes && typeof keyframes !== 'string') {
      keyframesRef = sanitiseIdent(hash(JSON.stringify(keyframes)));

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

      for (const condition of rule.conditions ?? []) {
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

const specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

const interpolateLocalClassNames = (selector: string) => {
  const localClassNames = getRegisteredClassNames();

  if (localClassNames.length === 0) {
    return selector;
  }

  const localClassNamesRegex = RegExp(`(${localClassNames.join('|')})`, 'g');

  return selector.replace(localClassNamesRegex, (_, match) => {
    return `.${match}`;
  });
};

function transformSelectors(
  stylesheet: Stylesheet,
  rule: StyleWithSelectors,
  rootSelector: string,
  conditions?: Array<string>,
) {
  each(rule.selectors, (selectorRule, selector) => {
    validateSelector(selector);

    stylesheet.addRule({
      conditions,
      selector: selector.replace(RegExp('&', 'g'), rootSelector),
      rule: selectorRule,
    });
  });
}

function transformMedia(
  stylesheet: Stylesheet,
  rules:
    | MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>>
    | undefined,
  rootSelector: string,
  parentConditions: Array<string> = [],
) {
  each(rules, (mediaRule, query) => {
    const conditions = [`@media ${query}`, ...parentConditions];

    stylesheet.addRule({
      conditions,
      selector: rootSelector,
      rule: omit(mediaRule, specialKeys),
    });

    transformSimplePsuedos(stylesheet, mediaRule!, rootSelector, conditions);
    transformSelectors(stylesheet, mediaRule!, rootSelector, conditions);
    transformSupports(
      stylesheet,
      mediaRule!['@supports'],
      rootSelector,
      conditions,
    );
  });
}

function transformSupports(
  stylesheet: Stylesheet,
  rules:
    | FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>
    | undefined,
  rootSelector: string,
  parentConditions: Array<string> = [],
) {
  each(rules, (supportsRule, query) => {
    const conditions = [`@supports ${query}`, ...parentConditions];

    stylesheet.addRule({
      conditions,
      selector: rootSelector,
      rule: omit(supportsRule, specialKeys),
    });

    transformSimplePsuedos(stylesheet, supportsRule!, rootSelector, conditions);
    transformSelectors(stylesheet, supportsRule!, rootSelector, conditions);
    transformMedia(
      stylesheet,
      supportsRule!['@media'],
      rootSelector,
      conditions,
    );
  });
}

function transformSimplePsuedos(
  stylesheet: Stylesheet,
  rule: CSS['rule'],
  rootSelector: string,
  conditions?: Array<string>,
) {
  for (const key of Object.keys(rule)) {
    // Process simple psuedos
    if (simplePseudoSet.has(key)) {
      stylesheet.addRule({
        conditions,
        selector: `${rootSelector}${key}`,
        rule: rule[key as keyof typeof rule] as CSSProperties,
      });
    }
  }
}

export function transformCss(...allCssObjs: Array<CSS>) {
  const stylesheet = new Stylesheet();

  for (const root of allCssObjs) {
    // Add main styles
    const mainRule = omit(root.rule, specialKeys);
    stylesheet.addRule({
      selector: root.selector,
      rule: mainRule,
    });

    transformSimplePsuedos(stylesheet, root.rule, root.selector);
    transformMedia(stylesheet, root.rule['@media'], root.selector);
    transformSupports(stylesheet, root.rule['@supports'], root.selector);
    transformSelectors(stylesheet, root.rule, root.selector);
  }

  return stylesheet.toPostcssJs();
}
