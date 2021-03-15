import type { Adapter } from './types';

let adapter: Adapter = {
  appendCss: () => {},
  registerClassName: () => {},
  getRegisteredClassNames: () => [],
  onEndFileScope: () => {},
};

export const setAdapter = (newAdapter: Adapter) => {
  adapter = newAdapter;
};

export const appendCss: Adapter['appendCss'] = (...props) => {
  return adapter.appendCss(...props);
};

export const registerClassName: Adapter['registerClassName'] = (...props) => {
  return adapter.registerClassName(...props);
};

export const getRegisteredClassNames: Adapter['getRegisteredClassNames'] = (
  ...props
) => {
  return adapter.getRegisteredClassNames(...props);
};

export const onEndFileScope: Adapter['onEndFileScope'] = (...props) => {
  return adapter.onEndFileScope(...props);
};
