import type { Adapter, Composition, CSS } from './types';
import { injectStyles } from './injectStyles';
import { transformCss } from './transformCss';
import { setAdapterIfNotSet } from './adapter';

const localClassNames = new Set<string>();
const composedClassLists: Array<Composition> = [];
let bufferedCSSObjs: Array<CSS> = [];

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
    }).join('\n');

    injectStyles({ fileScope, css });

    bufferedCSSObjs = [];
  },
  getIdentOption: () =>
    process.env.NODE_ENV === 'production' ? 'short' : 'debug',
};

if (typeof window !== 'undefined') {
  setAdapterIfNotSet(browserRuntimeAdapter);
}
