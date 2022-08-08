import { expect, describe, it } from 'vitest';

import { validateSelector } from './validateSelector';

describe('validateSelector', () => {
  describe('valid selectors', () => {
    const validSelectors = [
      '.target',
      '.target, .target',
      '.target:hover',
      '.target:hover:focus',
      '.target:where(:hover, :focus)',
      '.target:where(:hover, :focus), .target',
      '.target:is(:hover, :focus)',
      '.target:hover:focus:not(.a)',
      '.target:hover:focus:where(:not(.a, .b))',
      '.target:hover:focus:is(:not(.a, .b))',
      '.target.a',
      '.a.target',
      '.a.target.b',
      '.a.b.target',
      '.a .target',
      '.a .target:hover',
      '.a > .target',
      '.a ~ .target',
      '.a + .target',
      '.a > .b ~ .target',
      '.a > .b + .target:hover',
      '.a:where(.b, .c) > .target',
      '.a:is(.b, .c) > .target',
      '.target, .foo .target',
    ];

    validSelectors.forEach((selector) =>
      it(selector, () => {
        expect(() => validateSelector(selector, 'target')).not.toThrow();
      }),
    );
  });

  describe('invalid selectors', () => {
    const invalidSelectors = [
      '.a',
      '.target .a',
      '.target, .a',
      '.a, .target',
      '.target, .target, .a',
      '.a .target .b',
      '.target :hover',
      '.a .target :hover',
      '.target > .a',
      '.target + .a',
      '.target ~ .a',
      '.target:where(:hover, :focus) .a',
    ];

    invalidSelectors.forEach((selector) =>
      it(selector, () => {
        expect(() => validateSelector(selector, 'target')).toThrow();
      }),
    );
  });
});
