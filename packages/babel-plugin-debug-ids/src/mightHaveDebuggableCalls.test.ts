import { describe, expect, it } from 'vitest';
import { mightHaveDebuggableCalls } from './index';

describe('mightHaveDebuggableCalls', () => {
  it.each([
    ['named debuggable import', `import { style } from '@vanilla-extract/css';`],
    ['aliased debuggable import', `import { style as s } from '@vanilla-extract/css';`],
    ['namespace member call', `import * as css from '@vanilla-extract/css'; css.style({});`],
    ['styleVariants', `import { styleVariants } from '@vanilla-extract/css';`],
    ['createVar', `const v = createVar();`],
    ['layer', `const l = layer();`],
  ])('returns true for %s', (_label, source) => {
    expect(mightHaveDebuggableCalls(source)).toBe(true);
  });

  it.each([
    ['globalStyle only', `import { globalStyle } from '@vanilla-extract/css'; globalStyle(a, {});`],
    ['globalKeyframes only', `globalKeyframes('spin', {});`],
    ['globalFontFace only', `globalFontFace('x', {});`],
    ['createThemeContract only', `createThemeContract({});`],
    ['fallbackVar only', `fallbackVar(a, b);`],
    ['no vanilla-extract at all', `export const x = 1;`],
  ])('returns false for %s', (_label, source) => {
    expect(mightHaveDebuggableCalls(source)).toBe(false);
  });
});
