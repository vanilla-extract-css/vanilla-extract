import { describe, it, expect } from 'vitest';
import { transformNextFont } from './transform';

const idTs = '/abs/path/file.ts';
const idTsx = '/abs/path/file.tsx';
const idJsx = '/abs/path/file.jsx';

describe('next-font transform (SWC)', () => {
  it('noop when no next/font usage', async () => {
    const src = `export const x = 1;`;
    const out = await transformNextFont(src, idTs);
    expect(out.usedNextFont).toBe(false);
    expect(out.changed).toBe(false);
    expect(out.code).toContain('export const x = 1');
  });

  it('local import removal and call rewrite', async () => {
    const src = `
      import localFont from 'next/font/local';
      export const MyFont = localFont({ src: [{ path: './a.woff2', weight: '400' }] });
    `;
    const out = await transformNextFont(src, idTs);
    expect(out.usedNextFont).toBe(true);
    expect(out.changed).toBe(true);
    expect(out.code).not.toMatch(/from\s+['\"]next\/font\/local['\"]/);
    expect(out.code).toMatch(/__veLocal\('MyFont'/);
    expect(out.details.find((d) => d.exportName === 'MyFont')).toBeTruthy();
    // helper preamble injected once
    const preambleCount = (out.code.match(/const __VE_FONT_MSG/g) || []).length;
    expect(preambleCount).toBe(1);
  });

  it('google named imports → proxy consts; underscores→spaces', async () => {
    const src = `
      import { Roboto, Roboto_Flex as Flex } from 'next/font/google';
      export const A = Roboto({ weight: '400' });
      export const B = Flex({ style: 'italic' });
    `;
    const out = await transformNextFont(src, idTsx);
    expect(out.usedNextFont).toBe(true);
    expect(out.changed).toBe(true);
    expect(out.code).not.toMatch(/from\s+['\"]next\/font\/google['\"]/);
    expect(out.code).toMatch(/const Roboto = \(\.\.\.args\) => __veGoogle\('Roboto'/);
    expect(out.code).toMatch(/const Flex = \(\.\.\.args\) => __veGoogle\('Roboto Flex'/);
    expect(out.code).toMatch(/__veGoogle\('Roboto',/);
    expect(out.code).toMatch(/__veGoogle\('Roboto Flex',/);
  });

  it('multiple font usages → inject helpers once', async () => {
    const src = `
      import localFont from 'next/font/local';
      import { Roboto } from 'next/font/google';
      const A = localFont({ src: [{ path: './a.woff2', weight: '400' }] });
      const B = Roboto({ weight: '700' });
    `;
    const out = await transformNextFont(src, idJsx);
    const preambleCount = (out.code.match(/const __VE_FONT_MSG/g) || []).length;
    expect(preambleCount).toBe(1);
  });

  it('exposes style.fontFamily and throws on className/variable at runtime (smoke)', async () => {
    const src = `
      import localFont from 'next/font/local';
      const A = localFont({ fallback: ['system-ui'] });
      export { A };
    `;
    const out = await transformNextFont(src, idTs);
    const mod = { exports: {} as any };
    // eslint-disable-next-line no-new-func
    const fn = new Function('module', out.code + '\nreturn module.exports;');
    const exports = fn(mod);
    expect(typeof exports.A.style.fontFamily).toBe('string');
    expect(() => (exports.A as any).className).toThrow();
    expect(() => (exports.A as any).variable).toThrow();
  });

  it('gracefully handles malformed input without crashing', async () => {
    const src = `import localFont from 'next/font/local'; export const A = localFont( /* missing */ `;
    const out = await transformNextFont(src, idTs);
    // Either SWC path or regex fallback returns string output
    expect(typeof out.code).toBe('string');
  });
});


