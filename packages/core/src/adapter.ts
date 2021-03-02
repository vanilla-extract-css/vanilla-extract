import type { Adapter } from './types';

let adapter: Adapter = {
  appendCss: () => {},
};

export const setAdapter = (newAdapter: Adapter) => {
  adapter = newAdapter;
};

export const appendCss: Adapter['appendCss'] = (...props) => {
  return adapter.appendCss(...props);
};
