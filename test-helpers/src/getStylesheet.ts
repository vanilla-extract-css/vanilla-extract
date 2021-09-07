import postcss from 'postcss';
import prettier from 'prettier';
// @ts-expect-error
import cssnano from 'cssnano';
import got from 'got';

export const stylesheetName = 'main.css';

export async function getStylesheet(url: string, stylesheetName = 'main.css') {
  const response = await got(`${url}/${stylesheetName}`);
  const { css } = await postcss([cssnano({ preset: 'default' })]).process(
    response.body,
    {
      from: undefined,
    },
  );

  return prettier.format(css, { parser: 'css' });
}
