import { StyleRule } from './types';

type CssCacheValue = { rule: Readonly<StyleRule>; index: number };

let currentClassNameIndex = 0;
const cache = new Map<string, CssCacheValue>();

// ensures duplicated rules are applied in the same order they were created in
export const classNameSortCompareFn = (a: string, b: string) =>
  (cache.get(a)?.index ?? 0) - (cache.get(b)?.index ?? 0);

export const cssCache = {
  forEach(
    callbackFn: (value: Readonly<StyleRule>, className: string) => void,
  ): void {
    cache.forEach((value, className) => callbackFn(value.rule, className));
  },

  get(className: string): Readonly<StyleRule> | undefined {
    if (className.split(' ').length > 1) {
      throw new Error(
        `Invalid className "${className}": found multiple classNames, try CssCache.getAll() instead.`,
      );
    }

    return cache.get(className)?.rule;
  },

  getAll(...classNames: string[]): Readonly<StyleRule>[] {
    const normalizedClassNames: string[] = [];
    for (const className of classNames) {
      className.split(' ').forEach((singleClassName) => {
        const trimmedSingleClassName = singleClassName.trim();
        if (trimmedSingleClassName) {
          normalizedClassNames.push(trimmedSingleClassName);
        }
      });
    }

    return normalizedClassNames
      .sort(classNameSortCompareFn)
      .map((className) => cache.get(className)?.rule)
      .filter((rule) => rule !== undefined) as Readonly<StyleRule>[];
  },

  has(className: string): boolean {
    return cache.has(className);
  },

  set(className: string, rule: StyleRule): void {
    if (className.split(' ').length > 1) {
      throw new Error(
        `Invalid className "${className}": found multiple classNames.`,
      );
    }
    if (!cache.has(className)) {
      cache.set(className, { rule, index: currentClassNameIndex });
      currentClassNameIndex += 1;
    }
  },

  get size() {
    return cache.size;
  },
};

export type CssCache = typeof cssCache;
