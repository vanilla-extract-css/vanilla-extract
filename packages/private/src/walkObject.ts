import { MapLeafNodes } from './types';

type Primitive = string | number | null | undefined;

type Walkable = {
  [Key in string | number]: Primitive | Walkable;
};

export function walkObject<T extends Walkable, MapTo>(
  obj: T,
  fn: (value: Primitive, path: Array<string>) => MapTo,
  path: Array<string> = [],
): MapLeafNodes<T, MapTo> {
  const clone = {} as any;

  for (let key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      value == null
    ) {
      clone[key] = fn(value as Primitive, currentPath);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      clone[key] = walkObject(value as Walkable, fn, currentPath);
    } else {
      console.warn(
        `Skipping invalid key "${currentPath.join(
          '.',
        )}". Should be a string, number, null or object. Received: "${
          Array.isArray(value) ? 'Array' : typeof value
        }"`,
      );
    }
  }

  return clone;
}
