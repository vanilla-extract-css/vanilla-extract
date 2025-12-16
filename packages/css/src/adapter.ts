import { cssCache } from './cssCache';
import type { Adapter } from './types';

export const mockAdapter: Adapter = {
  appendCss: () => {},
  registerClassName: () => {},
  onEndFileScope: () => {},
  registerComposition: () => {},
  markCompositionUsed: () => {},
  getIdentOption: () =>
    process.env.NODE_ENV === 'production' ? 'short' : 'debug',
};

const adapterStack: Array<Adapter> = [mockAdapter];

const currentAdapter = () => {
  if (adapterStack.length < 1) {
    throw new Error('No adapter configured');
  }

  return adapterStack[adapterStack.length - 1];
};

let hasConfiguredAdapter = false;

export const setAdapterIfNotSet = (newAdapter: Adapter): void => {
  if (!hasConfiguredAdapter) {
    setAdapter(newAdapter);
  }
};

export const setAdapter = (newAdapter: Adapter): void => {
  if (!newAdapter) {
    throw new Error('No adapter provided when calling "setAdapter"');
  }

  hasConfiguredAdapter = true;

  adapterStack.push(newAdapter);
};

export const removeAdapter = (): void => {
  adapterStack.pop();
};

export const appendCss: Adapter['appendCss'] = (...props) => {
  const cssDef = props[0];
  if (cssDef.type === 'local' || cssDef.type === 'global') {
    const { selector, rule } = cssDef;
    cssCache.set(selector, rule);
  }

  return currentAdapter().appendCss(...props);
};

export const registerClassName: Adapter['registerClassName'] = (...props) => {
  return currentAdapter().registerClassName(...props);
};

export const registerComposition: Adapter['registerComposition'] = (
  ...props
) => {
  return currentAdapter().registerComposition(...props);
};

export const markCompositionUsed: Adapter['markCompositionUsed'] = (
  ...props
) => {
  return currentAdapter().markCompositionUsed(...props);
};

export const onBeginFileScope: NonNullable<Adapter['onBeginFileScope']> = (
  ...props
) => {
  return currentAdapter().onBeginFileScope?.(...props);
};

export const onEndFileScope: Adapter['onEndFileScope'] = (...props) => {
  return currentAdapter().onEndFileScope(...props);
};

export const getIdentOption: Adapter['getIdentOption'] = (...props) => {
  const adapter = currentAdapter();

  // Backwards compatibility with old versions of the integration package
  if (!('getIdentOption' in adapter)) {
    return process.env.NODE_ENV === 'production' ? 'short' : 'debug';
  }

  return adapter.getIdentOption(...props);
};
