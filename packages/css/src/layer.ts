import { appendCss } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

type LayerOptions = {
  parent?: string;
};
const defaultLayerOptions: LayerOptions = {};

const merge = <T>(obj1: Partial<T>, obj2: Partial<T>) => ({ ...obj1, ...obj2 });

const getLayerArgs = <Options extends LayerOptions>(
  ...args: any[]
): [Options, string] => {
  let options = defaultLayerOptions;
  let debugId: string = args[0];

  if (typeof args[0] === 'object') {
    options = merge(defaultLayerOptions, args[0]);
    debugId = args[1];
  }

  return [options as Options, debugId];
};

export function layer(options: LayerOptions, debugId?: string): string;
export function layer(debugId?: string): string;
export function layer(...args: any[]): string {
  const [options, debugId] = getLayerArgs<LayerOptions>(...args);

  let name = generateIdentifier(debugId);
  if (options.parent) {
    name = `${options.parent}.${name}`;
  }

  appendCss({ type: 'layer', name }, getFileScope());

  return name;
}

export const layer$ = layer;

export function globalLayer(options: LayerOptions, name: string): string;
export function globalLayer(name: string): string;
export function globalLayer(...args: any[]): string {
  let [options, name] = getLayerArgs<LayerOptions>(...args);

  if (options.parent) {
    name = `${options.parent}.${name}`;
  }

  appendCss({ type: 'layer', name }, getFileScope());

  return name;
}

export const globalLayer$ = globalLayer;
