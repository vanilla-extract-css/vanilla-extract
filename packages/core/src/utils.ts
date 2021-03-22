import { MapLeafNodes } from './types';

type BasicObj = { [key: string]: any };

export function get(obj: any, path: Array<string>) {
  let result = obj;

  for (const key of path) {
    result = result[key];
  }

  return result;
}

export function forEach<Input extends BasicObj>(
  obj: Input | undefined,
  fn: <Key extends keyof Input>(value: Input[Key], key: string) => void,
) {
  for (const key in obj) {
    fn(obj[key], key);
  }
}

export function omit<Input extends BasicObj, OmitKey extends string>(
  obj: Input | undefined,
  omitKeys: Array<OmitKey>,
): Omit<Input, OmitKey> {
  let result: any = {};

  for (const key in obj) {
    if (omitKeys.indexOf(key as any) === -1) {
      result[key] = obj[key];
    }
  }

  return result;
}

export function mapKeys<Input extends BasicObj>(
  obj: Input | undefined,
  fn: <Key extends keyof Input>(value: Input[Key], key: string) => string,
): Record<string, Input[keyof Input]> {
  let result: any = {};

  for (const key in obj) {
    result[fn(obj[key], key)] = obj[key];
  }

  return result;
}

export function walkObject<T, MapTo>(
  obj: T,
  fn: (value: string | number, path: Array<string>) => MapTo,
  path: Array<string> = [],
): MapLeafNodes<T, MapTo> {
  // @ts-expect-error
  const clone = obj.constructor();

  for (let key in obj) {
    const value = obj[key];
    const currentPath = [...path, key];

    if (typeof value === 'object') {
      clone[key] = value ? walkObject(value, fn, currentPath) : value;
    } else if (typeof value === 'string' || typeof value === 'number') {
      clone[key] = fn(value, currentPath);
    } else {
      console.warn(
        `Skipping invalid key "${currentPath.join(
          '.',
        )}". Should be a string, number or object. Received: "${typeof value}"`,
      );
    }
  }

  return clone;
}

export function isEqual(a: any, b: any) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'object') {
    const keys1 = Object.keys(a);
    const keys2 = Object.keys(b);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key in a) {
      if (!isEqual(a[key], b[key])) {
        return false;
      }
    }

    return true;
  } else {
    return a === b;
  }
}
