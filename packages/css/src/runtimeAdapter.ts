import type { Adapter, CSS } from './types';
import { transformCss } from './transformCss';
import { setAdapter } from './adapter';

const stylesheets: Record<string, CSSStyleSheet> = {};

const localClassNames = new Set<string>();
let bufferedCSSObjs: Array<CSS> = [];

function getStylesheet(fileScope: string) {
  if (stylesheets[fileScope]) {
    return stylesheets[fileScope];
  }
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  if (!styleEl.sheet) {
    throw new Error(`Couldn't create stylesheet`);
  }
  stylesheets[fileScope] = styleEl.sheet;

  return styleEl.sheet;
}

const browserRuntimeAdapter: Adapter = {
  appendCss: (cssObj: CSS) => {
    bufferedCSSObjs.push(cssObj);
  },
  registerClassName: (className) => {
    localClassNames.add(className);
  },
  onEndFileScope: (fileScope) => {
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      cssObjs: bufferedCSSObjs,
    });
    const stylesheet = getStylesheet(fileScope);
    const existingRuleCount = stylesheet.cssRules.length;

    let ruleIndex = 0;

    for (const rule of css) {
      try {
        if (ruleIndex < existingRuleCount) {
          stylesheet.deleteRule(ruleIndex);
        }
        stylesheet.insertRule(rule, ruleIndex++);
      } catch (e) {
        console.warn(`Failed to insert rule\n${rule}`);

        // insert placeholder rule to keep index count correct
        stylesheet.insertRule('.--placeholder-rule--{}', ruleIndex - 1);
      }
    }

    // Delete remaining rules
    while (ruleIndex < existingRuleCount) {
      stylesheet.deleteRule(ruleIndex++);
    }

    bufferedCSSObjs = [];
  },
};

if (typeof window !== 'undefined') {
  setAdapter(browserRuntimeAdapter);
}
