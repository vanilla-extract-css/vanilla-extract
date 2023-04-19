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
export { createContainer } from './container';

export const css$ = <T>(t: T): T => t;
