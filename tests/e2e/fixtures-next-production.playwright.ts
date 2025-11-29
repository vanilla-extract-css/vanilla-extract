import {
  nextFixtures,
  startFixture,
  type TestServer,
} from '@vanilla-extract-private/test-helpers';
import { expect } from '@playwright/test';

import test from './fixture';

const testCases = [
  {
    type: 'next-12-pages-router',
    mode: 'production',
  },
  {
    type: 'next-13-app-router',
    mode: 'production',
  },
  {
    type: 'next-16-app-pages-router',
    mode: 'production',
  },
] as const;

testCases.forEach(({ type, mode }) => {
  test.describe.serial(`${type} (${mode})`, async () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture('', {
        type,
        basePort: port,
        mode,
      });
    });

    test(`screenshot`, async ({ page }) => {
      for await (const fixture of nextFixtures) {
        await page.goto(`${server.url}/${fixture}`);
        // make sure the fixture is visible
        await page.waitForSelector(`#${fixture}`, { state: 'attached' });
        expect(await page.screenshot()).toMatchSnapshot(`${fixture}.png`);
      }
    });

    test.afterAll(async () => {
      await server.close();
    });
  });
});
