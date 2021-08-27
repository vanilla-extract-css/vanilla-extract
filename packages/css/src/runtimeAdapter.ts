import type { Adapter, Composition, CSS, FileScope } from './types';
import { transformCss } from './transformCss';
import { setAdapterIfNotSet } from './adapter';

const stylesheets: Record<string, CSSStyleSheet> = {};

const localClassNames = new Set<string>();
const composedClassLists: Array<Composition> = [];
let bufferedCSSObjs: Array<CSS> = [];

function getStylesheet({ packageName, filePath }: FileScope) {
  const fileScopeId = packageName ? `${packageName}${filePath}` : filePath;
  if (stylesheets[fileScopeId]) {
    return stylesheets[fileScopeId];
  }
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);

  if (!styleEl.sheet) {
    throw new Error(`Couldn't create stylesheet`);
  }
  stylesheets[fileScopeId] = styleEl.sheet;

  return styleEl.sheet;
}

const browserRuntimeAdapter: Adapter = {
  appendCss: (cssObj: CSS) => {
    bufferedCSSObjs.push(cssObj);
  },
  registerClassName: (className) => {
    localClassNames.add(className);
  },
  registerComposition: (composition) => {
    composedClassLists.push(composition);
  },
  markCompositionUsed: () => {},
  onEndFileScope: (fileScope) => {
    const css = transformCss({
      localClassNames: Array.from(localClassNames),
      composedClassLists,
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
  getIdentOption: () =>
    process.env.NODE_ENV === 'production' ? 'short' : 'debug',
};

if (typeof window !== 'undefined') {
  setAdapterIfNotSet(browserRuntimeAdapter);
}
