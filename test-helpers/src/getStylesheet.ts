import got from 'got';

export const stylesheetName = 'main.css';

export async function getStylesheet(url: string, stylesheetName = 'main.css') {
  const response = await got(`${url}/${stylesheetName}`);

  return response.body;
}
