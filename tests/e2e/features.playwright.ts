import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  type TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';
import { all as testCases, viteInlineCssInDev } from './testCases';

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

viteInlineCssInDev.forEach(({ type, mode, inlineCssInDev }) => {
  test.describe(`features - ${type} (${mode}) inlineCssInDev: ${inlineCssInDev}`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('features', {
        type,
        mode,
        basePort: port,
        inlineCssInDev,
      });
    });

    test('screenshot', async ({ page }) => {
      const response = await page.goto(server.url);

      if (!response) {
        throw new Error('Failed to load the page');
      }
      expect(await response.body()).toMatchSnapshot(
        `features-${type}--${mode}-inlineCssInDev-${inlineCssInDev}.html`,
      );
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
