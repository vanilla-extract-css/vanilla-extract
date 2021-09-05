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
  // 'snowpack', Snowpack seems to be broken for the Sprinkles fixture
] as const;

buildTypes.forEach((buildType) => {
  test.describe(buildType, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('sprinkles', {
        type: buildType,
        basePort: port,
      });
    });

    test('screenshot diff', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('sprinkles');
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
