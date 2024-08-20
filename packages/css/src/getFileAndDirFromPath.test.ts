import { getFileAndDirFromPath } from './getFileAndDirFromPath';

const testCases = [
  {
    name: 'longPath',
    input:
      'node_modules/.pnpm/braid-design-system@32.23.0_@types+react@18.3.3_babel-plugin-macros@3.1.0_react-dom@18.3.1_re_ctndskkf4y74v2qksfjwfz6ezy/node_modules/braid-design-system/dist/lib/components/ButtonDir/Button.css.mjs',
    expected: { dir: 'ButtonDir', file: 'Button' },
  },
  {
    name: 'emojiPath',
    input: 'node_modules/my_package/dist/👨‍👩‍👦Test🎉Dir👨‍🚀/Test🎉File👨‍🚀.css.ts',
    expected: { dir: '👨‍👩‍👦Test🎉Dir👨‍🚀', file: 'Test🎉File👨‍🚀' },
  },
  {
    name: 'loneSurrogates',
    input: 'node_modules/my_package/dist/Test\uD801Dir/Test\uDC01File.css.ts',
    expected: { dir: 'Test\uD801Dir', file: 'Test\uDC01File' },
  },
  {
    name: 'noExtension',
    input: 'node_modules/my_package/dist/TestDir/TestFile',
    expected: undefined,
  },
  {
    name: 'singleFileSparator',
    input: 'src/Button.css.ts',
    expected: { dir: 'src', file: 'Button' },
  },
  {
    name: 'noDir',
    input: 'myFile.css.ts',
    expected: { file: 'myFile' },
  },
];

describe('getFileAndDirFromPath', () => {
  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      expect(getFileAndDirFromPath(input)).toStrictEqual(expected);
    });
  });
});
