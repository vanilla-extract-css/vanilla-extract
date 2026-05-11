import { describe, expect, it } from 'vitest';
import { assignInlineVars } from './';
import { vars } from './assignInlineVars.css.ts';

describe('assignInlineVars', () => {
  describe('basic assignment', () => {
    const style = assignInlineVars({
      [vars.foo.bar]: '1',
      [vars.baz.qux]: '2',
      '--global-var-1': '3',
      '--global-var-2': '4',
      '--global-var-3': undefined,
      '--global-var-4': null,
    });

    it('assigns vars', () => {
      expect(style).toMatchInlineSnapshot(`
        {
          "--baz-qux__17tpfwq1": "2",
          "--foo-bar__17tpfwq0": "1",
          "--global-var-1": "3",
          "--global-var-2": "4",
        }
      `);
    });

    it('converts to valid inline styles when calling toString', () => {
      expect(style.toString()).toMatchInlineSnapshot(
        `"--foo-bar__17tpfwq0:1;--baz-qux__17tpfwq1:2;--global-var-1:3;--global-var-2:4"`,
      );
    });
  });

  describe('contract assignment', () => {
    const style = assignInlineVars(vars, {
      foo: { bar: '1' },
      baz: { qux: '2' },
    });

    it('assigns contract vars', () => {
      expect(style).toMatchInlineSnapshot(`
        {
          "--baz-qux__17tpfwq1": "2",
          "--foo-bar__17tpfwq0": "1",
        }
      `);
    });

    it('converts to valid inline styles when calling toString', () => {
      expect(style.toString()).toMatchInlineSnapshot(
        `"--foo-bar__17tpfwq0:1;--baz-qux__17tpfwq1:2"`,
      );
    });
  });
});
