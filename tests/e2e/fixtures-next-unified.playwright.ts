import { expect, test } from '@playwright/test';
import { NEXT_SERVERS } from '../servers';

const limited = [
  { route: '/features', index: '/' },
  { route: '/recipes', index: '/' },
  { route: '/sprinkles', index: '/' },
];

const full = [
  { route: '/features', index: '/' },
  { route: '/recipes', index: '/' },
  { route: '/sprinkles', index: '/' },
  { route: '/pages-router/features', index: '/pages-router' },
  { route: '/pages-router/recipes', index: '/pages-router' },
  { route: '/pages-router/sprinkles', index: '/pages-router' },
  { route: '/creepster', index: '/' },
  { route: '/duplication-test', index: '/' },
  { route: '/function-serializer', index: '/' },
  { route: '/next-font', index: '/' },
  { route: '/next-image', index: '/' },
];

const getTasks = (type: 'full' | 'limited') => {
  if (type === 'full') return full;
  return limited;
};

NEXT_SERVERS.map((server) => {
  test.describe(server.name, () => {
    const tasks = getTasks(server.suite);

    for (const { route, index: indexUrl } of tasks) {
      const snapshotPrefix =
        // font names are different between webpack and turbopack
        route.includes('next-font') && server.name.includes('Webpack')
          ? 'next-font-webpack'
          : route.split('/').at(-1);

      // FIXME: webpack fails the creepster test!
      if (server.name.includes('Webpack') && route.includes('creepster')) {
        continue;
      }

      // Test SSR
      test(`${route} - SSR`, async ({ page }) => {
        const targetUrl = `http://localhost:${server.port}${route}`;
        await page.goto(targetUrl, { waitUntil: 'networkidle' });

        expect(await page.screenshot()).toMatchSnapshot(
          `${snapshotPrefix}.png`,
        );
      });

      // FIXME: webpack dev in next 16 fails CSR tests!
      if (
        server.name.includes('Webpack') &&
        server.name.includes('Next 16') &&
        route.includes('pages-router')
      ) {
        continue;
      }
      // FIXME: turbopack build in next 16 fails CSR tests!
      if (
        server.name.includes('Turbopack') &&
        server.name.includes('Next 16') &&
        route.includes('pages-router')
      ) {
        continue;
      }

      // Test CSR
      test(`${route} - CSR`, async ({ page }) => {
        await page.goto(`http://localhost:${server.port}${indexUrl}`);

        const linkLocator = page.locator(`a[href="${route}"]`).first();
        await linkLocator.click();

        // Prevent triggering a css hover on the new page
        await page.mouse.move(0, 0);

        await page.waitForURL(`http://localhost:${server.port}${route}`);
        await page.waitForLoadState('networkidle');

        expect(await page.screenshot()).toMatchSnapshot(
          `${snapshotPrefix}.png`,
        );
      });
    }
  });
});
