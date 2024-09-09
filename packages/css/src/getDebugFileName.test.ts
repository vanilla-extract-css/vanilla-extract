import { getDebugFileName } from './getDebugFileName';

const testCases = [
  {
    name: 'longPath',
    input:
      'node_modules/.pnpm/braid-design-system@32.23.0_@types+react@18.3.3_babel-plugin-macros@3.1.0_react-dom@18.3.1_re_ctndskkf4y74v2qksfjwfz6ezy/node_modules/braid-design-system/dist/lib/components/ButtonDir/Button.css.mjs',
    expected: 'Button',
  },
  {
    name: 'emojiPath',
    input: 'node_modules/my_package/dist/👨‍👩‍👦Test🎉Dir👨‍🚀/Test🎉File👨‍🚀.css.ts',
    expected: 'Test🎉File👨‍🚀',
  },
  {
    name: 'loneSurrogates',
    input: 'node_modules/my_package/dist/Test\uD801Dir/Test\uDC01File.css.ts',
    expected: 'Test\uDC01File',
  },
  {
    name: 'noExtension',
    input: 'node_modules/my_package/dist/TestDir/TestFile',
    expected: '',
  },
  {
    name: 'singleFileSparator',
    input: 'src/Button.css.ts',
    expected: 'Button',
  },
  {
    name: 'noDir',
    input: 'myFile.css.ts',
    expected: 'myFile',
  },
];

describe('getDebugFileName', () => {
  testCases.forEach(({ name, input, expected }) => {
    it(name, () => {
      const result = getDebugFileName(input);

      expect(result).toStrictEqual(expected);
    });
  });
});
