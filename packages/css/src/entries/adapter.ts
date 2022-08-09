import type { Adapter } from '../types';

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

export const setAdapterIfNotSet = (newAdapter: Adapter) => {
  if (!hasConfiguredAdapter) {
    setAdapter(newAdapter);
  }
};

export const setAdapter = (newAdapter: Adapter) => {
  hasConfiguredAdapter = true;

  adapterStack.push(newAdapter);
};

export const removeAdapter = () => {
  adapterStack.pop();
};

export const appendCss: Adapter['appendCss'] = (...props) => {
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
