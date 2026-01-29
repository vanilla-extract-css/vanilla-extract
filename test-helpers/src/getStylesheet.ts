import postcss from 'postcss';
import prettier from 'prettier';
import litePreset from 'cssnano-preset-lite';
import cssnano from 'cssnano';

export const stylesheetName = 'main.css';

export async function getStylesheet(url: string, stylesheetName = 'main.css') {
  const response = await fetch(new URL(stylesheetName, url));
  // Just remove comments and normalize whitespace
  // https://cssnano.co/docs/what-are-optimisations/#what-optimisations-do-you-support%3F
  const { css } = await postcss([cssnano({ preset: litePreset() })]).process(
    await response.text(),
    {
      from: undefined,
    },
  );

  return prettier.format(css, { parser: 'css' });
}
