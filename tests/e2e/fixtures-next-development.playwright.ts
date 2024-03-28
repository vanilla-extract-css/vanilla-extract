import {
  nextFixtures,
  startFixture,
  TestServer,
} from '@vanilla-extract-private/test-helpers';
import { expect } from '@playwright/test';

import test from './fixture';

const testCases = [
  {
    type: 'next-pages-router',
    mode: 'development',
    clientSideRouting: true,
  },
  {
    type: 'next-app-router',
    mode: 'development',
    clientSideRouting: false,
  },
] as const;

testCases.forEach(({ type, mode, clientSideRouting }) => {
  test.describe.serial(`${type} (${mode})`, async () => {
    let server: TestServer;

    test.beforeAll(async ({ port }) => {
      server = await startFixture(type, {
        type,
        basePort: port,
        mode,
      });
    });

    test(`screenshot`, async ({ page }) => {
      for await (const fixture of nextFixtures) {
        const fixtureUrl = `${server.url}/${fixture}`;

        await page.goto(fixtureUrl);
        await page.waitForSelector(`#${fixture}`, { state: 'attached' });
        expect(await page.screenshot()).toMatchSnapshot(`${fixture}.png`);
      }
    });

    if (clientSideRouting) {
      test(`screenshot (csr)`, async ({ page }) => {
        for await (const fixture of nextFixtures) {
          await page.goto(server.url);
          await page.waitForLoadState('networkidle');

          const fixtureUrl = `${server.url}/${fixture}`;
          // navigate to fixture page via link
          const loc = page.locator('a', { hasText: fixture });
          await loc.click();
          // prevent triggering a css hover on the new page
          await page.mouse.move(0, 0);
          await page.waitForURL(fixtureUrl);
          await page.waitForLoadState('networkidle');

          await page.waitForSelector(`#${fixture}`, {
            state: 'attached',
          });
          expect(await page.screenshot()).toMatchSnapshot(`${fixture}.png`);
        }
      });
    }

    test.afterAll(async () => {
      await server.close();
    });
  });
});
