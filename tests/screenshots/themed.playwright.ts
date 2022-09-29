import { expect } from '@playwright/test';
import {
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';

const buildTypes = [
  'mini-css-extract',
  'style-loader',
  'esbuild',
  'esbuild-runtime',
  'vite',
] as const;

buildTypes.forEach((buildType) => {
  test.describe(buildType, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('themed', {
        type: buildType,
        basePort: port,
      });
    });

    test('themed', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('themed.png');
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
