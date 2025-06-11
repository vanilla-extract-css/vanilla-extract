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

export {
  /** @deprecated - Use `createSprinkles` */
  createSprinkles as createAtomsFn,
};
