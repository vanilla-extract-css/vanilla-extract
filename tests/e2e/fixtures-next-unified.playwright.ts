import { test, expect } from '@playwright/test';
import { NEXT_SERVERS } from '../servers';

NEXT_SERVERS.forEach((server) => {
  test.describe(server.name, () => {
    test('visual regression', async ({ page }) => {
      const indexPages = server.name.includes('Next 16')
        ? ['/', '/pages-router']
        : ['/'];

      const tasks: { link: string; indexUrl: string }[] = [];

      for (const indexPage of indexPages) {
        const indexUrl = `http://localhost:${server.port}${indexPage}`;
        await page.goto(indexUrl, { waitUntil: 'domcontentloaded' });

        const links = await page
          .locator('a[href^="/"]')
          .evaluateAll((anchors: HTMLAnchorElement[]) =>
            anchors
              .map((a) => a.getAttribute('href'))
              .filter((href): href is string => typeof href === 'string'),
          );

        const uniqueLinks = Array.from(new Set(links));
        uniqueLinks.forEach((link) => {
          tasks.push({ link, indexUrl });
        });
      }

      for (const { link, indexUrl } of tasks) {
        const snapshotPrefix =
          // font names are different between webpack and turbopack
          link.includes('next-font') && server.name.includes('Webpack')
            ? 'next-font-webpack'
            : link.split('/').at(-1);

        // FIXME: webpack nextJS fails the creepster test!
        if (server.name.includes('Webpack') && link.includes('creepster')) {
          continue;
        }

        // Test SSR
        await test.step(`${link} - SSR`, async () => {
          const targetUrl = `http://localhost:${server.port}${link}`;
          await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

          expect(await page.screenshot()).toMatchSnapshot(
            `${snapshotPrefix}.png`,
          );
        });

        // Test CSR
        await test.step(`${link} - CSR`, async () => {
          await page.goto(indexUrl, { waitUntil: 'domcontentloaded' });

          const linkLocator = page.locator(`a[href="${link}"]`).first();
          await linkLocator.click();

          // Prevent triggering a css hover on the new page
          await page.mouse.move(0, 0);

          await page.waitForURL(`http://localhost:${server.port}${link}`);

          expect(await page.screenshot()).toMatchSnapshot(
            `${snapshotPrefix}.png`,
          );
        });
      }
    });
  });
});
