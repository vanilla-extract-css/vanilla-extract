import { describe, expect, it } from 'vitest';
/**
 * @vitest-environment jsdom
 */
import { setElementVars } from './';
import { vars } from './assignInlineVars.css.ts';

describe('setElementVars', () => {
  it('assigns vars', () => {
    const el = document.body.appendChild(document.createElement('div'));

    setElementVars(el, {
      [vars.foo.bar]: '1',
      [vars.baz.qux]: '2',
      '--global-var-1': '3',
      '--global-var-2': '4',
      '--global-var-3': undefined,
      '--global-var-4': null,
    });

    // Can't query CSS vars directly as jsdom doesn't support it
    expect(el.getAttribute('style')).toMatchInlineSnapshot(
      `"--foo-bar__17tpfwq0: 1; --baz-qux__17tpfwq1: 2; --global-var-1: 3; --global-var-2: 4;"`,
    );
  });

  it('assigns contract vars', () => {
    const el = document.body.appendChild(document.createElement('div'));

    setElementVars(el, vars, {
      foo: { bar: '1' },
      baz: { qux: '2' },
    });

    // Can't query CSS vars directly as jsdom doesn't support it
    expect(el.getAttribute('style')).toMatchInlineSnapshot(
      `"--foo-bar__17tpfwq0: 1; --baz-qux__17tpfwq1: 2;"`,
    );
  });
});
