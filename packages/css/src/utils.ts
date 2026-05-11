import type { ClassNames } from './types';

type BasicObj = { [key: string]: any };

export function forEach<Input extends BasicObj>(
  obj: Input | undefined,
  fn: <Key extends keyof Input>(value: Input[Key], key: string) => void,
): void {
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

function composeStylesIntoSet(
  set: Set<string>,
  ...classNames: Array<ClassNames>
) {
  for (const className of classNames) {
    if (className.length === 0) {
      continue;
    }

    if (typeof className === 'string') {
      if (className.includes(' ')) {
        composeStylesIntoSet(set, ...className.trim().split(' '));
      } else {
        set.add(className);
      }
    } else if (Array.isArray(className)) {
      composeStylesIntoSet(set, ...className);
    }
  }
}

export function dedupeAndJoinClassList(classNames: Array<ClassNames>) {
  const set: Set<string> = new Set();

  composeStylesIntoSet(set, ...classNames);

  return Array.from(set).join(' ');
}
