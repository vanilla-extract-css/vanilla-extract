import './runtimeAdapter';

export type {
  StyleRule,
  ComplexStyleRule,
  GlobalStyleRule,
  Adapter,
  FileScope,
  CSSProperties,
} from './types';
export * from './identifier';
export * from './theme';
export * from './style';
export * from './vars';
export * from './layer';
export { createContainer, createContainer$ } from './container';

export const extract$ = <T>(t: (() => T) | T): T => {
  if (typeof t === 'function') {
    // @ts-expect-error
    return t();
  }

  return t;
};
