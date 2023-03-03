import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';

const testCases = [
  { buildType: 'mini-css-extract', mode: 'development', snapshotCss: true },
  { buildType: 'mini-css-extract', mode: 'production', snapshotCss: true },
  { buildType: 'style-loader', mode: 'development', snapshotCss: false },
  { buildType: 'esbuild', mode: 'development', snapshotCss: true },
  { buildType: 'esbuild', mode: 'production', snapshotCss: true },
  { buildType: 'esbuild-runtime', mode: 'development', snapshotCss: false },
  { buildType: 'esbuild-runtime', mode: 'production', snapshotCss: false },
  { buildType: 'vite', mode: 'development', snapshotCss: false },
  { buildType: 'vite', mode: 'production', snapshotCss: true },
  { buildType: 'parcel', mode: 'development', snapshotCss: true },
  { buildType: 'parcel', mode: 'production', snapshotCss: true },
] as const;

testCases.forEach(({ buildType, mode, snapshotCss = true }) => {
  test.describe(`themed - ${buildType} (${mode})`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('themed', {
        type: buildType,
        mode,
        basePort: port,
      });
    });

    test('screenshot', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('themed.png');
    });

    if (snapshotCss) {
      test('CSS @agnostic', async () => {
        expect(
          await getStylesheet(server.url, server.stylesheet),
        ).toMatchSnapshot(`themed-${buildType}--${mode}.css`);
      });
    }

    test.afterAll(async () => {
      await server.close();
    });
  });
});
