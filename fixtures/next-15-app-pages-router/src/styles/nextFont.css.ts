import * as fonts from './fonts';

export const pickedValues = Object.fromEntries(
  Object.entries(fonts).map(
    ([importName, { style }]) =>
      [
        importName,
        {
          fontFamily: style.fontFamily,
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
        },
      ] as const,
  ),
) as Record<
  keyof typeof fonts,
  {
    fontFamily: string;
    fontWeight: number;
    fontStyle: string;
  }
>;


