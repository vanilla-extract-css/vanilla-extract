import { generateCss } from './generateCss';
import type { Adapter, CSS } from './types';

let styleSheet: CSSStyleSheet | null;
const localClassNames = new Set<string>();

function getStylesheet() {
  if (styleSheet) {
    return styleSheet;
  }
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  styleSheet = styleEl.sheet;

  return styleSheet;
}

export const browserRuntimeAdapter: Adapter = {
  appendCss: (cssObj: CSS) => {
    const css = generateCss(cssObj);

    for (const rule of css) {
      getStylesheet()?.insertRule(rule);
    }
  },
  registerClassName: (className) => {
    localClassNames.add(className);
  },
  getRegisteredClassNames: () => Array.from(localClassNames),
};
