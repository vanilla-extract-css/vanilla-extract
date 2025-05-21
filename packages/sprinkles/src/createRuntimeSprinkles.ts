import {
  createSprinkles as internalCreateSprinkles,
  type SprinklesFn,
} from './createSprinkles';
import type { SprinklesProperties } from './types';

const composeStyles = (classList: string) => classList;

export const createSprinkles = <
  Args extends ReadonlyArray<SprinklesProperties>,
>(
  ...args: Args
): SprinklesFn<Args> => internalCreateSprinkles(composeStyles)(...args);

/** @deprecated - Use `createSprinkles` */
export const createAtomsFn = createSprinkles;
