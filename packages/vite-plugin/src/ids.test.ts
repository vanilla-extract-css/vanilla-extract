import { existsSync } from 'fs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { getAbsoluteId } from './ids';

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();

  return { ...actual, existsSync: vi.fn(actual.existsSync) };
});

const mockExistingDirectories = (directories: string[]) => {
  vi.mocked(existsSync).mockImplementation((filePath) =>
    directories.includes(String(filePath)),
  );
};

describe('getAbsoluteId', () => {
  afterEach(() => {
    vi.mocked(existsSync).mockReset();
  });

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

  it('resolves SSR-style root-relative ids that start with the root directory name', () => {
    mockExistingDirectories(['/app/app/routes']);

    expect(
      getAbsoluteId({
        root: '/app',
        filePath: '/app/routes/_index.css.ts.vanilla.css',
      }),
    ).toBe('/app/app/routes/_index.css.ts.vanilla.css');
  });

  it('keeps absolute paths inside a root that matches the first directory name', () => {
    mockExistingDirectories(['/app/app/routes']);

    expect(
      getAbsoluteId({
        root: '/app',
        filePath: '/app/app/routes/_index.css.ts.vanilla.css',
      }),
    ).toBe('/app/app/routes/_index.css.ts.vanilla.css');
  });

  it('does not treat sibling directories with the root as a prefix as inside the root', () => {
    expect(
      getAbsoluteId({
        root: '/app',
        filePath: '/application/styles.css.ts.vanilla.css',
      }),
    ).toBe('/app/application/styles.css.ts.vanilla.css');
  });

  const cases = [
    '@id/C:/example-repo/packages/example-lib/src/styles.css.ts.vanilla.css',
    '/app/styles.css.ts.vanilla.css',
  ];

  it.each(cases)(
    'is idempotent when applied to an already-resolved id',
    (filePath) => {
      const root = 'C:/example-repo/apps/example-app';
      const resolved = getAbsoluteId({ root, filePath });

      expect(getAbsoluteId({ root, filePath: resolved })).toBe(resolved);
    },
  );
});
