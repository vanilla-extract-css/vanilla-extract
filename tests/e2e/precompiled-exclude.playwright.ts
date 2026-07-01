import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  type TestServer,
} from '@vanilla-extract-private/test-helpers';
import type { VanillaExtractPluginOptions } from '@vanilla-extract/vite-plugin';

import test from './fixture';

// Test cases for vite only - we're testing the vite plugin exclude option
const viteTestCases = [
  { type: 'vite' as const, mode: 'development' as const },
  { type: 'vite' as const, mode: 'production' as const },
];

viteTestCases.forEach(({ type, mode }) => {
  test.describe(`precompiled-exclude - ${type} (${mode})`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      // Use the exclude option to prevent processing the precompiled library
      server = await startFixture('precompiled-exclude', {
        type,
        mode,
        basePort: port,
        vanillaExtractOptions: {
          exclude: ['**/precompiled-lib/**'],
        } satisfies VanillaExtractPluginOptions,
      } as any);
    });

    test('screenshot', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot(
        'precompiled-exclude.png',
      );
    });

    test('CSS @agnostic', async () => {
      expect(
        await getStylesheet(server.url, server.stylesheet),
      ).toMatchSnapshot(`precompiled-exclude-${type}--${mode}.css`);
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});

// Test that the build FAILS without the exclude option
test.describe('precompiled-exclude - without exclude option (should fail)', () => {
  test('build fails when precompiled library is processed', async ({
    port,
  }) => {
    // This test verifies that without the exclude option, the build fails
    // with "Invalid exports" error because the recipe function can't be serialized
    await expect(
      startFixture('precompiled-exclude', {
        type: 'vite',
        mode: 'production',
        basePort: port,
        // No exclude option - should fail
      }),
    ).rejects.toThrow(/Invalid exports/);
  });
});
