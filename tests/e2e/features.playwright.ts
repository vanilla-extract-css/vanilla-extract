import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';

const testCases = [
  { type: 'mini-css-extract', mode: 'development', snapshotCss: true },
  { type: 'mini-css-extract', mode: 'production', snapshotCss: true },
  { type: 'style-loader', mode: 'development', snapshotCss: false },
  { type: 'esbuild', mode: 'development', snapshotCss: true },
  { type: 'esbuild', mode: 'production', snapshotCss: true },
  { type: 'esbuild-runtime', mode: 'development', snapshotCss: false },
  { type: 'esbuild-runtime', mode: 'production', snapshotCss: false },
  { type: 'esbuild-next', mode: 'development', snapshotCss: true },
  { type: 'esbuild-next', mode: 'production', snapshotCss: true },
  { type: 'esbuild-next-runtime', mode: 'development', snapshotCss: false },
  { type: 'esbuild-next-runtime', mode: 'production', snapshotCss: false },
  { type: 'vite', mode: 'development', snapshotCss: false },
  { type: 'vite', mode: 'production', snapshotCss: true },
  { type: 'parcel', mode: 'development', snapshotCss: true },
  { type: 'parcel', mode: 'production', snapshotCss: true },
] as const;

testCases.forEach(({ type, mode, snapshotCss = true }) => {
  test.describe(`features - ${type} (${mode})`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('features', {
        type,
        mode,
        basePort: port,
      });
    });

    test('screenshot', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('features.png');
    });

    if (snapshotCss) {
      test('CSS @agnostic', async () => {
        expect(
          await getStylesheet(server.url, server.stylesheet),
        ).toMatchSnapshot(`features-${type}--${mode}.css`);
      });
    }

    test.afterAll(async () => {
      await server.close();
    });
  });
});
