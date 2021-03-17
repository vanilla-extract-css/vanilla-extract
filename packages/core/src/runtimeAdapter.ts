import { generateCss } from './generateCss';
import type { Adapter, CSS } from './types';

let styleSheet: CSSStyleSheet | null;
const localClassNames = new Set<string>();
let bufferedCSSObjs: Array<CSS> = [];

function getStylesheet() {
  if (styleSheet) {
    return styleSheet;
  }
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;

  if (!styleSheet) {
    throw new Error('Could create stylesheet');
  }

  return styleSheet;
}

export const browserRuntimeAdapter: Adapter = {
  appendCss: (cssObj: CSS) => {
    bufferedCSSObjs.push(cssObj);
  },
  registerClassName: (className) => {
    localClassNames.add(className);
  },
  onEndFileScope: () => {
    const css = generateCss({
      localClassNames: Array.from(localClassNames),
      cssObjs: bufferedCSSObjs,
    });
    const stylesheet = getStylesheet();

    for (const rule of css) {
      try {
        stylesheet.insertRule(rule, stylesheet.cssRules.length);
      } catch (e) {
        console.warn(e);
      }
    }

    bufferedCSSObjs = [];
  },
};
