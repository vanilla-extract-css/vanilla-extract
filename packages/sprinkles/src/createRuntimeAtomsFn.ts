import { createAtomsFn as internalCreateAtomsFn } from './createAtomsFn';

const composeStyles = (classList: string) => classList;

export const createAtomsFn = internalCreateAtomsFn(composeStyles);
