import { escapeWebpackTemplateString } from './compiler';

describe('escapeWebpackTemplateString()', () => {
  test.each([
    '/some/path/[...slug].js',
    '/some/path/[[...slug]]/index.js',
    '/some/path[]/[slug]/[[foo]]/index.js',
  ])('%s pattern', (filePath) => {
    expect(escapeWebpackTemplateString(filePath)).toMatchSnapshot();
  });
});
