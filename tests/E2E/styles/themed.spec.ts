import { test, expect } from '@playwright/test';
import { startFixture, TestServer } from 'test-helpers';

const buildTypes = [
  'browser',
  'mini-css-extract',
  'style-loader',
  'esbuild',
  'esbuild-runtime',
  'vite',
  'snowpack',
] as const;

buildTypes.forEach((buildType, index) => {
  test.describe(buildType, () => {
    let server: TestServer;

    test.beforeAll(async ({}, testInfo) => {
      const portRange = 100 * testInfo.workerIndex;
      server = await startFixture('themed', {
        type: buildType,
        basePort: 10000 + portRange + index,
      });
    });

    test('screenshot diff', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('themed');
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
