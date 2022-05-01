import { getVarName } from '@vanilla-extract/private';
import cssesc from 'cssesc';
import escapeStringRegexp from 'escape-string-regexp';

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
  Composition,
} from './types';
import { markCompositionUsed } from './adapter';
import { forEach, omit, mapKeys } from './utils';
import { validateSelector } from './validateSelector';
import { ConditionalRuleset } from './conditionalRulesets';
import { simplePseudos, simplePseudoLookup } from './simplePseudos';
import { validateMediaQuery } from './validateMediaQuery';

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

function dashify(str: string) {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/^ms-/, '-ms-')
    .toLowerCase();
}

const DOUBLE_SPACE = '  ';

const specialKeys = [...simplePseudos, '@media', '@supports', 'selectors'];

interface CSSRule {
  conditions?: Array<string>;
  selector: string;
  rule: CSSPropertiesWithVars;
}

class Stylesheet {
  rules: Array<CSSRule>;
  conditionalRulesets: Array<ConditionalRuleset>;
  currConditionalRuleset: ConditionalRuleset | undefined;
  fontFaceRules: Array<GlobalFontFaceRule>;
  keyframesRules: Array<CSSKeyframesBlock>;
  localClassNameRegex: RegExp | null;
  composedClassLists: Array<{ identifier: string; regex: RegExp }>;

  constructor(
    localClassNames: Array<string>,
    composedClassLists: Array<Composition>,
  ) {
    this.rules = [];
    this.conditionalRulesets = [new ConditionalRuleset()];
    this.fontFaceRules = [];
    this.keyframesRules = [];
    this.localClassNameRegex =
      localClassNames.length > 0
        ? RegExp(`(${localClassNames.map(escapeStringRegexp).join('|')})`, 'g')
        : null;

    // Class list compositions should be priortized by Newer > Older
    // Therefore we reverse the array as they are added in sequence
    this.composedClassLists = composedClassLists
      .map(({ identifier, classList }) => ({
        identifier,
        regex: RegExp(`(${classList})`, 'g'),
      }))
      .reverse();
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

    this.currConditionalRuleset = new ConditionalRuleset();

    this.transformMedia(root, root.rule['@media']);
    this.transformSupports(root, root.rule['@supports']);

    this.transformSimplePseudos(root, root.rule);
    this.transformSelectors(root, root.rule);

    const activeConditionalRuleset =
      this.conditionalRulesets[this.conditionalRulesets.length - 1];

    if (
      !activeConditionalRuleset.mergeIfCompatible(this.currConditionalRuleset)
    ) {
      // Ruleset merge failed due to incompatibility. We now deopt by starting a fresh ConditionalRuleset
      this.conditionalRulesets.push(this.currConditionalRuleset);
    }
  }

  addConditionalRule(cssRule: CSSRule, conditions: Array<string>) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    const rule = this.transformVars(
      this.transformContent(this.pixelifyProperties(cssRule.rule)),
    );
    const selector = this.transformSelector(cssRule.selector);

    if (!this.currConditionalRuleset) {
      throw new Error(`Couldn't add conditional rule`);
    }

    const conditionQuery = conditions[conditions.length - 1];
    const parentConditions = conditions.slice(0, conditions.length - 1);

    this.currConditionalRuleset.addRule(
      {
        selector,
        rule,
      },
      conditionQuery,
      parentConditions,
    );
  }

  addRule(cssRule: CSSRule) {
    // Run `pixelifyProperties` before `transformVars` as we don't want to pixelify CSS Vars
    const rule = this.transformVars(
      this.transformContent(this.pixelifyProperties(cssRule.rule)),
    );
    const selector = this.transformSelector(cssRule.selector);

    this.rules.push({
      selector,
      rule,
    });
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

  transformContent({ content, ...rest }: CSSPropertiesWithVars) {
    if (typeof content === 'undefined') {
      return rest;
    }

    // Handle fallback arrays:
    const contentArray = Array.isArray(content) ? content : [content];

    return {
      content: contentArray.map((value) =>
        // This logic was adapted from Stitches :)
        value &&
        (value.includes('"') ||
          value.includes("'") ||
          /^([A-Za-z\-]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)(\s|$)/.test(
            value,
          ))
          ? value
          : `"${value}"`,
      ),
      ...rest,
    };
  }

  transformSelector(selector: string) {
    // Map class list compositions to single identifiers
    let transformedSelector = selector;
    for (const { identifier, regex } of this.composedClassLists) {
      transformedSelector = transformedSelector.replace(regex, () => {
        markCompositionUsed(identifier);

        return identifier;
      });
    }

    return this.localClassNameRegex
      ? transformedSelector.replace(
          this.localClassNameRegex,
          (_, className, index) => {
            if (index > 0 && transformedSelector[index - 1] === '.') {
              return className;
            }

            return `.${cssesc(className, { isIdentifier: true })}`;
          },
        )
      : transformedSelector;
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

      const rule = {
        selector: transformedSelector,
        rule: omit(selectorRule, specialKeys),
      };

      if (conditions) {
        this.addConditionalRule(rule, conditions);
      } else {
        this.addRule(rule);
      }

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
    if (rules) {
      this.currConditionalRuleset?.addConditionPrecedence(
        parentConditions,
        Object.keys(rules).map((query) => `@media ${query}`),
      );

      forEach(rules, (mediaRule, query) => {
        validateMediaQuery(query);

        const conditions = [...parentConditions, `@media ${query}`];

        this.addConditionalRule(
          {
            selector: root.selector,
            rule: omit(mediaRule, specialKeys),
          },
          conditions,
        );

        if (root.type === 'local') {
          this.transformSimplePseudos(root, mediaRule!, conditions);
          this.transformSelectors(root, mediaRule!, conditions);
        }

        this.transformSupports(root, mediaRule!['@supports'], conditions);
      });
    }
  }

  transformSupports(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules:
      | FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>
      | undefined,
    parentConditions: Array<string> = [],
  ) {
    if (rules) {
      this.currConditionalRuleset?.addConditionPrecedence(
        parentConditions,
        Object.keys(rules).map((query) => `@supports ${query}`),
      );

      forEach(rules, (supportsRule, query) => {
        const conditions = [...parentConditions, `@supports ${query}`];

        this.addConditionalRule(
          {
            selector: root.selector,
            rule: omit(supportsRule, specialKeys),
          },
          conditions,
        );

        if (root.type === 'local') {
          this.transformSimplePseudos(root, supportsRule!, conditions);
          this.transformSelectors(root, supportsRule!, conditions);
        }
        this.transformMedia(root, supportsRule!['@media'], conditions);
      });
    }
  }

  transformSimplePseudos(
    root: CSSStyleBlock | CSSSelectorBlock,
    rule: StyleRule,
    conditions?: Array<string>,
  ) {
    for (const key of Object.keys(rule)) {
      // Process simple pseudos
      if (simplePseudoLookup[key]) {
        if (root.type !== 'local') {
          throw new Error(
            `Simple pseudos are not valid in ${
              root.type === 'global' ? '"globalStyle"' : '"selectors"'
            }`,
          );
        }

        if (conditions) {
          this.addConditionalRule(
            {
              selector: `${root.selector}${key}`,
              rule: rule[key as keyof typeof rule] as CSSPropertiesWithVars,
            },
            conditions,
          );
        } else {
          this.addRule({
            conditions,
            selector: `${root.selector}${key}`,
            rule: rule[key as keyof typeof rule] as CSSPropertiesWithVars,
          });
        }
      }
    }
  }

  toCss() {
    const css: Array<string> = [];

    // Render font-face rules
    for (const fontFaceRule of this.fontFaceRules) {
      css.push(renderCss({ '@font-face': fontFaceRule }));
    }

    // Render keyframes
    for (const keyframe of this.keyframesRules) {
      css.push(renderCss({ [`@keyframes ${keyframe.name}`]: keyframe.rule }));
    }

    // Render unconditional rules
    for (const rule of this.rules) {
      css.push(renderCss({ [rule.selector]: rule.rule }));
    }

    // Render conditional rules
    for (const conditionalRuleset of this.conditionalRulesets) {
      for (const conditionalRule of conditionalRuleset.renderToArray()) {
        css.push(renderCss(conditionalRule));
      }
    }

    return css.filter(Boolean);
  }
}

function renderCss(v: any, indent: string = '') {
  const rules: Array<string> = [];

  for (const key of Object.keys(v)) {
    const value = v[key];

    if (value && Array.isArray(value)) {
      rules.push(...value.map((v) => renderCss({ [key]: v }, indent)));
    } else if (value && typeof value === 'object') {
      const isEmpty = Object.keys(value).length === 0;

      if (!isEmpty) {
        rules.push(
          `${indent}${key} {\n${renderCss(
            value,
            indent + DOUBLE_SPACE,
          )}\n${indent}}`,
        );
      }
    } else {
      rules.push(
        `${indent}${key.startsWith('--') ? key : dashify(key)}: ${value};`,
      );
    }
  }

  return rules.join('\n');
}

interface TransformCSSParams {
  localClassNames: Array<string>;
  composedClassLists: Array<Composition>;
  cssObjs: Array<CSS>;
}
export function transformCss({
  localClassNames,
  cssObjs,
  composedClassLists,
}: TransformCSSParams) {
  const stylesheet = new Stylesheet(localClassNames, composedClassLists);

  for (const root of cssObjs) {
    stylesheet.processCssObj(root);
  }

  return stylesheet.toCss();
}
