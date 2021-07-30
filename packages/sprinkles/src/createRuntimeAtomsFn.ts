import {
  createAtomsFn as internalCreateAtomsFn,
  AtomsFn,
} from './createAtomsFn';
import { AtomicStyles } from './types';

const composeStyles = (classList: string) => classList;

export const createAtomsFn = <Args extends ReadonlyArray<AtomicStyles>>(
  ...args: Args
): AtomsFn<Args> => internalCreateAtomsFn(composeStyles)(...args);
