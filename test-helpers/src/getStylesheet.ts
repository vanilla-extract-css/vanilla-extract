import type { Page } from '@playwright/test';
import postcss from 'postcss';
import prettier from 'prettier';
import litePreset from 'cssnano-preset-lite';
import cssnano from 'cssnano';

export const stylesheetName = 'main.css';

async function normalizeCss(raw: string): Promise<string> {
  const { css } = await postcss([cssnano({ preset: litePreset() })]).process(
    raw,
    { from: undefined },
  );
  return prettier.format(css, { parser: 'css' });
}

export async function getStylesheet(
  url: string,
  stylesheetName = 'main.css',
): Promise<string> {
  const response = await fetch(new URL(stylesheetName, url));
  return normalizeCss(await response.text());
}

export async function getPageStylesheets(
  page: Page,
  url: string,
): Promise<string> {
  await page.goto(url);
  const hrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
      (l) => (l as HTMLLinkElement).href,
    ),
  );

  const sheets = await Promise.all(
    hrefs.map(async (href) => {
      const res = await fetch(href);
      return res.text();
    }),
  );

  return normalizeCss(sheets.join('\n'));
}
