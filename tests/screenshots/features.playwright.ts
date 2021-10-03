import { expect } from '@playwright/test';
import { startFixture, TestServer } from 'test-helpers';

import test from './fixture';

const buildTypes = [
  'browser',
  'mini-css-extract',
  'style-loader',
  'esbuild',
  'esbuild-runtime',
  'vite',
  'snowpack',
] as const;

buildTypes.forEach((buildType) => {
  test.describe(buildType, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('features', {
        type: buildType,
        basePort: port,
      });
    });

    test('features', async ({ page }) => {
      await page.goto(server.url, { timeout: 60 });

      expect(await page.screenshot()).toMatchSnapshot('features.png');
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
