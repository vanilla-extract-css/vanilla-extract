import type { Adapter } from './types';

let styleSheet: CSSStyleSheet | null;

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
  appendCss: (css) => {
    getStylesheet()?.insertRule(css);
  },
};
