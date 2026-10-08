import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockAdapter, removeAdapter, setAdapter } from './adapter';
import { endFileScope, setFileScope } from './fileScope';
import { style } from './style';
import { transformCss } from './transformCss';

const appendCss = vi.fn();

const getLastRule = () => {
  const [css] = appendCss.mock.calls[appendCss.mock.calls.length - 1];
  return css.rule;
};

const toCss = (rule: any) =>
  transformCss({
    localClassNames: ['a'],
    composedClassLists: [],
    cssObjs: [{ type: 'local', selector: 'a', rule }],
  }).join('\n');

beforeEach(() => {
  setAdapter({ ...mockAdapter, appendCss });
  setFileScope('path/to/file.css.ts', 'foo-package');
});

afterEach(() => {
  endFileScope();
  removeAdapter();
  appendCss.mockClear();
});

describe('style composition', () => {
  // Likely to change in a major version when `filterValues: true` is set on `deepmergeCustom`
  it('honors undefined values in later rules', () => {
    style([{ color: 'red' }, { color: undefined }]);

    expect(toCss(getLastRule())).toMatchInlineSnapshot(`
      ".a {
        color: undefined;
      }"
    `);
  });

  // Likely to change in a major version when `filterValues: true` is set on `deepmergeCustom`
  it('honors undefined nested blocks in later rules', () => {
    style([{ ':hover': { color: 'red' } }, { ':hover': undefined }]);

    expect(toCss(getLastRule())).toMatchInlineSnapshot(`""`);
  });

  it('replaces arrays rather than merging them', () => {
    style([
      { fontFamily: ['Inter', 'sans-serif'] },
      { fontFamily: ['Georgia', 'serif'] },
    ]);

    expect(toCss(getLastRule())).toMatchInlineSnapshot(`
      ".a {
        font-family: Georgia;
        font-family: serif;
      }"
    `);
  });

  it('does not mutate shared input objects', () => {
    const shared = { ':hover': { padding: 4 } };
    style([shared, { color: 'red' }]);
    toCss(getLastRule());

    expect(shared).toEqual({ ':hover': { padding: 4 } });
  });
});
