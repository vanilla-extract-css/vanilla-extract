import { expect } from '@playwright/test';
import {
  getStylesheet,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';

import test from './fixture';
import { all as testCases } from './testCases';

testCases.forEach(({ type, mode, snapshotCss = true }) => {
  test.describe(`thirdparty - ${type} (${mode})`, () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('thirdparty', {
        type,
        mode,
        basePort: port,
      });
    });

    test('screenshot', async ({ page }) => {
      await page.goto(server.url);

      expect(await page.screenshot()).toMatchSnapshot('thirdparty.png');
    });

    if (snapshotCss) {
      test('CSS @agnostic', async () => {
        expect(
          await getStylesheet(server.url, server.stylesheet),
        ).toMatchSnapshot(`thirdparty-${type}--${mode}.css`);
      });
    }

    test.afterAll(async () => {
      await server.close();
    });
  });
});
