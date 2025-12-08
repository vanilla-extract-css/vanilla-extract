import { getVarName } from '@vanilla-extract/private';
import cssesc from 'cssesc';
import AhoCorasick from 'modern-ahocorasick';

import type {
  CSS,
  CSSStyleBlock,
  CSSKeyframesBlock,
  CSSPropertiesWithVars,
  StyleRule,
  StyleWithSelectors,
  GlobalFontFaceRule,
  CSSSelectorBlock,
  Composition,
  WithQueries,
  CSSPropertyBlock,
} from './types';
import { markCompositionUsed } from './adapter';
import { forEach, omit, mapKeys } from './utils';
import { validateSelector } from './validateSelector';
import { ConditionalRuleset } from './conditionalRulesets';
import { simplePseudos, simplePseudoLookup } from './simplePseudos';
import { validateMediaQuery } from './validateMediaQuery';

const DECLARATION = '__DECLARATION';

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
  scale: true,
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

function replaceBetweenIndexes(
  target: string,
  startIndex: number,
  endIndex: number,
  replacement: string,
) {
  const start = target.slice(0, startIndex);
  const end = target.slice(endIndex);

  return `${start}${replacement}${end}`;
}

const DOUBLE_SPACE = '  ';

const specialKeys = [
  ...simplePseudos,
  '@layer',
  '@media',
  '@supports',
  '@container',
  'selectors',
];

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
  localClassNamesMap: Map<string, string>;
  localClassNamesSearch: AhoCorasick;
  composedClassLists: Array<{ identifier: string; regex: RegExp }>;
  layers: Map<string, Array<string>>;
  propertyRules: Array<CSSPropertyBlock>;

  constructor(
    localClassNames: Array<string>,
    composedClassLists: Array<Composition>,
  ) {
    this.rules = [];
    this.conditionalRulesets = [new ConditionalRuleset()];
    this.fontFaceRules = [];
    this.keyframesRules = [];
    this.propertyRules = [];
    this.localClassNamesMap = new Map(
      localClassNames.map((localClassName) => [localClassName, localClassName]),
    );
    this.localClassNamesSearch = new AhoCorasick(localClassNames);
    this.layers = new Map();

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

    if (root.type === 'property') {
      this.propertyRules.push(root);

      return;
    }

    if (root.type === 'keyframes') {
      root.rule = Object.fromEntries(
        Object.entries(root.rule).map(([keyframe, rule]) => {
          return [keyframe, this.transformVars(this.transformProperties(rule))];
        }),
      );
      this.keyframesRules.push(root);

      return;
    }

    this.currConditionalRuleset = new ConditionalRuleset();

    if (root.type === 'layer') {
      const layerDefinition = `@layer ${root.name}`;
      this.addLayer([layerDefinition]);
    } else {
      // Add main styles
      const mainRule = omit(root.rule, specialKeys);
      this.addRule({
        selector: root.selector,
        rule: mainRule,
      });

      this.transformLayer(root, root.rule['@layer']);
      this.transformMedia(root, root.rule['@media']);
      this.transformSupports(root, root.rule['@supports']);
      this.transformContainer(root, root.rule['@container']);

      this.transformSimplePseudos(root, root.rule);
      this.transformSelectors(root, root.rule);
    }

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
    // Run `transformProperties` before `transformVars` as we don't want to pixelify CSS Vars
    const rule = this.transformVars(this.transformProperties(cssRule.rule));
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
    // Run `transformProperties` before `transformVars` as we don't want to pixelify CSS Vars
    const rule = this.transformVars(this.transformProperties(cssRule.rule));
    const selector = this.transformSelector(cssRule.selector);

    this.rules.push({
      selector,
      rule,
    });
  }

  addLayer(layer: Array<string>) {
    const uniqueLayerKey = layer.join(' - ');

    this.layers.set(uniqueLayerKey, layer);
  }

  transformProperties(cssRule: CSSPropertiesWithVars) {
    return this.transformContent(this.pixelifyProperties(cssRule));
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
          /^([A-Za-z-]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)(\s|$)/.test(
            value,
          ))
          ? value
          : `"${value}"`,
      ),
      ...rest,
    };
  }

  transformClassname(identifier: string) {
    return `.${cssesc(identifier, {
      isIdentifier: true,
    })}`;
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

    if (this.localClassNamesMap.has(transformedSelector)) {
      return this.transformClassname(transformedSelector);
    }

    const results = this.localClassNamesSearch.search(transformedSelector);

    let lastReplaceIndex = transformedSelector.length;

    // Perform replacements backwards to simplify index handling
    for (let i = results.length - 1; i >= 0; i--) {
      const [endIndex, [firstMatch]] = results[i];
      const startIndex = endIndex - firstMatch.length + 1;

      // Class names can be substrings of other class names
      // e.g. '_1g1ptzo1' and '_1g1ptzo10'
      //
      // Additionally, concatenated classnames can contain substrings equal to other classnames
      // e.g. '&&' where '&' is 'debugName_hash1' and 'debugName_hash1d' is also a local classname
      // Before transforming the selector, this would look like `debugName_hash1debugName_hash1`
      // which contains the substring `debugName_hash1d`’.
      //
      // In either of these cases, the last replace index will occur either before or within the
      // current replacement range (from `startIndex` to `endIndex`).
      // If this occurs, we skip the replacement to avoid transforming the selector incorrectly.
      const skipReplacement = lastReplaceIndex <= endIndex;

      if (skipReplacement) {
        continue;
      }

      lastReplaceIndex = startIndex;

      // If class names already starts with a '.' then skip
      if (transformedSelector[startIndex - 1] !== '.') {
        transformedSelector = replaceBetweenIndexes(
          transformedSelector,
          startIndex,
          endIndex + 1,
          this.transformClassname(firstMatch),
        );
      }
    }

    return transformedSelector;
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

      this.transformLayer(selectorRoot, selectorRule['@layer'], conditions);
      this.transformSupports(
        selectorRoot,
        selectorRule['@supports'],
        conditions,
      );
      this.transformMedia(selectorRoot, selectorRule['@media'], conditions);
      this.transformContainer(
        selectorRoot,
        selectorRule['@container'],
        conditions,
      );
    });
  }

  transformMedia(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules: WithQueries<StyleWithSelectors>['@media'],
    parentConditions: Array<string> = [],
  ) {
    if (rules) {
      this.currConditionalRuleset?.addConditionPrecedence(
        parentConditions,
        Object.keys(rules).map((query) => `@media ${query}`),
      );

      for (const [query, mediaRule] of Object.entries(rules)) {
        const mediaQuery = `@media ${query}`;

        validateMediaQuery(mediaQuery);

        const conditions = [...parentConditions, mediaQuery];

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

        this.transformLayer(root, mediaRule!['@layer'], conditions);
        this.transformSupports(root, mediaRule!['@supports'], conditions);
        this.transformContainer(root, mediaRule!['@container'], conditions);
      }
    }
  }

  transformContainer(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules: WithQueries<StyleWithSelectors>['@container'],
    parentConditions: Array<string> = [],
  ) {
    if (rules) {
      this.currConditionalRuleset?.addConditionPrecedence(
        parentConditions,
        Object.keys(rules).map((query) => `@container ${query}`),
      );

      forEach(rules, (containerRule, query) => {
        const containerQuery = `@container ${query}`;

        const conditions = [...parentConditions, containerQuery];

        this.addConditionalRule(
          {
            selector: root.selector,
            rule: omit(containerRule, specialKeys),
          },
          conditions,
        );

        if (root.type === 'local') {
          this.transformSimplePseudos(root, containerRule!, conditions);
          this.transformSelectors(root, containerRule!, conditions);
        }

        this.transformLayer(root, containerRule!['@layer'], conditions);
        this.transformSupports(root, containerRule!['@supports'], conditions);
        this.transformMedia(root, containerRule!['@media'], conditions);
      });
    }
  }

  transformLayer(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules: WithQueries<StyleWithSelectors>['@layer'],
    parentConditions: Array<string> = [],
  ) {
    if (rules) {
      this.currConditionalRuleset?.addConditionPrecedence(
        parentConditions,
        Object.keys(rules).map((name) => `@layer ${name}`),
      );

      forEach(rules, (layerRule, name) => {
        const conditions = [...parentConditions, `@layer ${name}`];
        this.addLayer(conditions);

        this.addConditionalRule(
          {
            selector: root.selector,
            rule: omit(layerRule, specialKeys),
          },
          conditions,
        );

        if (root.type === 'local') {
          this.transformSimplePseudos(root, layerRule!, conditions);
          this.transformSelectors(root, layerRule!, conditions);
        }

        this.transformMedia(root, layerRule!['@media'], conditions);
        this.transformSupports(root, layerRule!['@supports'], conditions);
        this.transformContainer(root, layerRule!['@container'], conditions);
      });
    }
  }

  transformSupports(
    root: CSSStyleBlock | CSSSelectorBlock,
    rules: WithQueries<StyleWithSelectors>['@supports'],
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

        this.transformLayer(root, supportsRule!['@layer'], conditions);
        this.transformMedia(root, supportsRule!['@media'], conditions);
        this.transformContainer(root, supportsRule!['@container'], conditions);
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

    // Render property rules
    for (const property of this.propertyRules) {
      css.push(renderCss({ [`@property ${property.name}`]: property.rule }));
    }

    // Render keyframes
    for (const keyframe of this.keyframesRules) {
      css.push(renderCss({ [`@keyframes ${keyframe.name}`]: keyframe.rule }));
    }

    // Render layer definitions
    for (const layer of this.layers.values()) {
      const [definition, ...nesting] = layer.reverse();
      let cssObj: Record<string, any> = {
        [definition]: DECLARATION,
      };

      for (const part of nesting) {
        cssObj = {
          [part]: cssObj,
        };
      }

      css.push(renderCss(cssObj));
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

function renderCss(v: Record<string, any>, indent: string = '') {
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
    } else if (value === DECLARATION) {
      rules.push(`${indent}${key};`);
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
}: TransformCSSParams): string[] {
  const stylesheet = new Stylesheet(localClassNames, composedClassLists);

  for (const root of cssObjs) {
    stylesheet.processCssObj(root);
  }

  return stylesheet.toCss();
}
