import { createAtomsFn as internalCreateAtomsFn } from './createAtomsFn';

const composeStyles = (v: string) => v;

export const createAtomsFn = internalCreateAtomsFn(composeStyles);
