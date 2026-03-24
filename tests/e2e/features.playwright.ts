import { expect, test } from '@playwright/test';
import { getPageStylesheets } from '@vanilla-extract-private/test-helpers';

import { BUNDLER_SERVERS } from '../servers';

const FIXTURE = 'features';

BUNDLER_SERVERS.filter((s) => s.fixtures.includes(FIXTURE)).forEach(
  ({ name, type, mode, port, snapshotCss }) => {
    test.describe(`${FIXTURE} - ${name}`, () => {
      const url = `http://localhost:${port}/${FIXTURE}/`;

      test('screenshot', async ({ page }) => {
        await page.goto(url);

        expect(await page.screenshot()).toMatchSnapshot(`${FIXTURE}.png`);
      });

      if (snapshotCss) {
        test('CSS @agnostic', async ({ page }) => {
          const css = await getPageStylesheets(page, url);
          expect(css).toMatchSnapshot(`${FIXTURE}-${type}--${mode}.css`);
        });
      }
    });
  },
);
