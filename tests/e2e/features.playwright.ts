import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  type TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';
import { all as testCases } from './testCases';

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
