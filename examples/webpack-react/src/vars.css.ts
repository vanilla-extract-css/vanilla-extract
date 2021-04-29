import { createGlobalTheme } from '@vanilla-extract/css';
import colors from 'tailwindcss/colors';

const createScale = (ratio: number, initial: number) => (x: number) =>
  `${initial + Math.round(Math.pow(ratio, x))}px`;

const ratio = 3 / 2;
const spaceScale = createScale(ratio, 2);
const fontSizeScale = createScale(ratio, 16);
const lineHeightScale = createScale(ratio, 24);

type TailwindPalette<Name extends string> = Record<
  `${Name}-${50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`,
  string
>;

const tailwindColorPalette = <ColorName extends keyof typeof colors>(
  colorName: ColorName,
): TailwindPalette<ColorName> =>
  ({
    [`${colorName}-50`]: colors[colorName][50],
    [`${colorName}-100`]: colors[colorName][100],
    [`${colorName}-200`]: colors[colorName][200],
    [`${colorName}-300`]: colors[colorName][300],
    [`${colorName}-400`]: colors[colorName][400],
    [`${colorName}-500`]: colors[colorName][500],
    [`${colorName}-600`]: colors[colorName][600],
    [`${colorName}-700`]: colors[colorName][700],
    [`${colorName}-800`]: colors[colorName][800],
    [`${colorName}-900`]: colors[colorName][900],
  } as TailwindPalette<ColorName>);

export const vars = createGlobalTheme(':root', {
  space: {
    '0': '0',
    '1x': spaceScale(1),
    '2x': spaceScale(2),
    '3x': spaceScale(3),
    '4x': spaceScale(4),
    '5x': spaceScale(5),
    '6x': spaceScale(6),
    '7x': spaceScale(7),
    '8x': spaceScale(8),
    '9x': spaceScale(9),
  },
  colors: {
    ...tailwindColorPalette('indigo'),
    ...tailwindColorPalette('green'),
  },
  fontFamily: {
    body: 'Helvetica, Arial',
  },
  fontSize: {
    '1x': fontSizeScale(1),
    '2x': fontSizeScale(2),
    '3x': fontSizeScale(3),
    '4x': fontSizeScale(4),
    '5x': fontSizeScale(5),
  },
  lineHeight: {
    '1x': lineHeightScale(1),
    '2x': lineHeightScale(2),
    '3x': lineHeightScale(3),
    '4x': lineHeightScale(4),
    '5x': lineHeightScale(5),
  },
});
