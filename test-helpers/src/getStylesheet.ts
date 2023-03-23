import postcss from 'postcss';
import prettier from 'prettier';
import litePreset from 'cssnano-preset-lite';
import cssnano from 'cssnano';
import got from 'got';

export const stylesheetName = 'main.css';

export async function getStylesheet(url: string, stylesheetName = 'main.css') {
  const response = await got(`${url}/${stylesheetName}`);
  const { css } = await postcss([cssnano({ preset: litePreset() })]).process(
    response.body,
    {
      from: undefined,
    },
  );

  return prettier.format(css, { parser: 'css' });
}
