import { describe, expect, it } from 'vitest';

import { getAbsoluteId } from './ids';

describe('getAbsoluteId', () => {
  it('unwraps Windows absolute Vite ids', () => {
    expect(
      getAbsoluteId({
        root: 'C:/Users/nit/projects/nettflater/apps/spkno',
        filePath:
          '@id/C:/Users/nit/projects/nettflater/packages/shared/src/PortableText/block/block.css.ts.vanilla.css',
      }),
    ).toBe(
      'C:/Users/nit/projects/nettflater/packages/shared/src/PortableText/block/block.css.ts.vanilla.css',
    );
  });

  it('unwraps Windows absolute Vite ids with a leading slash', () => {
    expect(
      getAbsoluteId({
        root: 'C:/Users/nit/projects/nettflater/apps/spkno',
        filePath:
          '/@id/C:/Users/nit/projects/nettflater/packages/shared/src/PortableText/block/block.css.ts.vanilla.css',
      }),
    ).toBe(
      'C:/Users/nit/projects/nettflater/packages/shared/src/PortableText/block/block.css.ts.vanilla.css',
    );
  });

  it('keeps absolute monorepo paths outside the app root', () => {
    expect(
      getAbsoluteId({
        root: '/Users/nit/projects/vanilla-extract/packages/vite-plugin',
        filePath:
          '/Users/nit/projects/vanilla-extract/packages/compiler/src/compiler.ts',
      }),
    ).toBe(
      '/Users/nit/projects/vanilla-extract/packages/compiler/src/compiler.ts',
    );
  });

  it('resolves SSR-style root-relative ids', () => {
    expect(
      getAbsoluteId({
        root: '/Users/nit/projects/vanilla-extract/packages/vite-plugin',
        filePath: '/app/styles.css.ts.vanilla.css',
      }),
    ).toBe(
      '/Users/nit/projects/vanilla-extract/packages/vite-plugin/app/styles.css.ts.vanilla.css',
    );
  });
});
