import { describe, expect, it } from 'vitest';

import { getAbsoluteId } from './ids';

describe('getAbsoluteId', () => {
  it('unwraps Windows absolute Vite ids', () => {
    expect(
      getAbsoluteId({
        root: 'C:/example-repo/apps/example-app',
        filePath:
          '@id/C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe(
      'C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
    );
  });

  it('unwraps Windows absolute Vite ids with a leading slash', () => {
    expect(
      getAbsoluteId({
        root: 'C:/example-repo/apps/example-app',
        filePath:
          '/@id/C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe(
      'C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
    );
  });

  it('unwraps posix absolute Vite ids', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath:
          '/@id//example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe('/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css');
  });

  it('normalizes slash-prefixed Windows absolute ids after Vite resolution', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath:
          '/C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe(
      'C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
    );
  });

  it('normalizes slash-prefixed Windows absolute ids on non-C drives', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath:
          '/D:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe(
      'D:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
    );
  });

  it('keeps plain Windows absolute paths inside the app root', () => {
    expect(
      getAbsoluteId({
        root: 'C:/example-repo/apps/example-app',
        filePath:
          'C:/example-repo/apps/example-app/src/styles.css.ts.vanilla.css',
      }),
    ).toBe('C:/example-repo/apps/example-app/src/styles.css.ts.vanilla.css');
  });

  it('keeps plain posix absolute paths inside the app root', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath:
          '/example-repo/apps/example-app/src/styles.css.ts.vanilla.css',
      }),
    ).toBe('/example-repo/apps/example-app/src/styles.css.ts.vanilla.css');
  });

  it('keeps absolute monorepo paths outside the app root', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath:
          '/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe('/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css');
  });

  it('keeps Windows monorepo paths on a different drive to the app root', () => {
    expect(
      getAbsoluteId({
        root: 'C:/example-repo/apps/example-app',
        filePath:
          'D:/other-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      }),
    ).toBe('D:/other-repo/packages/example-lib/src/styles.css.ts.vanilla.css');
  });

  it('resolves SSR-style root-relative ids', () => {
    expect(
      getAbsoluteId({
        root: '/example-repo/apps/example-app',
        filePath: '/app/styles.css.ts.vanilla.css',
      }),
    ).toBe('/example-repo/apps/example-app/app/styles.css.ts.vanilla.css');
  });

  it('is idempotent when applied to an already-resolved id', () => {
    const root = 'C:/example-repo/apps/example-app';
    const cases = [
      '@id/C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
      '/app/styles.css.ts.vanilla.css',
    ];

    for (const filePath of cases) {
      const resolved = getAbsoluteId({ root, filePath });

      expect(getAbsoluteId({ root, filePath: resolved })).toBe(resolved);
    }
  });
});
