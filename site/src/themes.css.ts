import { createGlobalTheme } from '@vanilla-extract/css';
import { computeValues } from './capsize';
import { Breakpoint } from './themeUtils';

const grid = 4;
const px = (value: string | number) => `${value}px`;

const fontMetrics = {
  brand: {
    capHeight: 669,
    ascent: 1026,
    descent: -432,
    lineGap: 0,
    unitsPerEm: 1000,
  },
  heading: {
    capHeight: 700,
    ascent: 992,
    descent: -310,
    lineGap: 0,
    unitsPerEm: 1000,
  },
  body: {
    capHeight: 1443,
    ascent: 1950,
    descent: -494,
    lineGap: 0,
    unitsPerEm: 2048,
  },
  code: {
    capHeight: 1456,
    ascent: 2146,
    descent: -555,
    lineGap: 0,
    unitsPerEm: 2048,
  },
};

const tailwindPalette = {
  white: '#fff',

  // tw-coolGray
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // tw-emerald
  green50: '#ecfdf5',
  green100: '#d1fae5',
  green200: '#a7f3d0',
  green300: '#6ee7b7',
  green400: '#34d399',
  green500: '#10b981',
  green600: '#059669',
  green700: '#047857',
  green800: '#065f46',
  green900: '#064e3b',

  // tw-lightblue
  blue50: '#f0f9ff',
  blue100: '#e0f2fe',
  blue200: '#bae6fd',
  blue300: '#7dd3fc',
  blue400: '#38bdf8',
  blue500: '#0ea5e9',
  blue600: '#0284c7',
  blue700: '#0369a1',
  blue800: '#075985',
  blue900: '#0c4a6e',

  // tw-fuschia
  pink50: '#fdf4ff',
  pink100: '#fae8ff',
  pink200: '#f5d0fe',
  pink300: '#f0abfc',
  pink400: '#e879f9',
  pink500: '#d946ef',
  pink600: '#c026d3',
  pink700: '#a21caf',
  pink800: '#86198f',
  pink900: '#701a75',
};

const palette = {
  black: '#000',
  white: '#fff',
  // https://hihayk.github.io/scale/#3/3/50/80/0/0/100/29/8991a5/137/145/165/white
  gray700: '#434855',
  gray600: '#5A6070',
  gray500: '#71788B',
  gray400: '#8991a5',
  gray300: '#A5ADC0',
  gray200: '#C4CAD9',
  gray100: '#E5E8F0',

  // https://hihayk.github.io/scale/#3/3/44/80/0/0/100/29/76C0FF/118/190/255/white
  // Customised 600 for a11y
  blue700: '#376C8F',
  blue600: '#437CA4',
  blue500: '#5FA4DA',
  blue400: '#76C0FF',
  blue300: '#8AD2FF',
  blue200: '#AAE3FF',
  blue100: '#D6F4FF',

  // https://hihayk.github.io/scale/#3/3/44/80/0/0/20/44/F090F5/240/144/245/white
  pink700: '#8F448F',
  pink600: '#B35BB4',
  pink500: '#D375D7',
  pink400: '#F090F5',
  pink300: '#F6ABFA',
  pink200: '#FBC8FE',
  pink100: '#FEE7FF',

  // https://hihayk.github.io/scale/#3/3/44/80/0/0/20/-20/26E08A/38/224/138/white
  green700: '#20734D',
  green600: '#249661',
  green500: '#26BA75',
  green400: '#26E08A',
  green300: '#5BEDAA',
  green200: '#94F6C9',
  green100: '#D0FDE8',
};

const calculateTypographyStyles = (
  definition: Record<Breakpoint, { fontSize: number; rows: number }>,
  type: keyof typeof fontMetrics,
) => {
  const mobile = computeValues({
    fontSize: definition.mobile.fontSize,
    leading: definition.mobile.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const tablet = computeValues({
    fontSize: definition.tablet.fontSize,
    leading: definition.tablet.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  const desktop = computeValues({
    fontSize: definition.desktop.fontSize,
    leading: definition.desktop.rows * grid,
    fontMetrics: fontMetrics[type],
  });

  return {
    mobile: {
      fontSize: mobile.fontSize,
      lineHeight: mobile.lineHeight,
      capHeightTrim: mobile.capHeightTrim,
      baselineTrim: mobile.baselineTrim,
    },
    tablet: {
      fontSize: tablet.fontSize,
      lineHeight: tablet.lineHeight,
      capHeightTrim: tablet.capHeightTrim,
      baselineTrim: tablet.baselineTrim,
    },
    desktop: {
      fontSize: desktop.fontSize,
      lineHeight: desktop.lineHeight,
      capHeightTrim: desktop.capHeightTrim,
      baselineTrim: desktop.baselineTrim,
    },
  };
};

export const vars = createGlobalTheme(':root', {
  fonts: {
    brand: 'Shrikhand, "Helvetica Neue", HelveticaNeue, Helvetica, sans-serif',
    heading:
      '"DM Sans", "Helvetica Neue", HelveticaNeue, Helvetica, sans-serif',
    body:
      '-apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif',
    code: '"Roboto Mono", Menlo, monospace',
  },
  grid: px(grid),
  spacing: {
    none: '0',
    xsmall: px(1 * grid),
    small: px(2 * grid),
    medium: px(3 * grid),
    large: px(5 * grid),
    xlarge: px(8 * grid),
    xxlarge: px(12 * grid),
    xxxlarge: px(24 * grid),
  },
  contentWidth: {
    standard: px(860),
    large: px(1350),
  },
  heading: {
    h1: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 36,
          rows: 12,
        },
        tablet: {
          fontSize: 52,
          rows: 15,
        },
        desktop: {
          fontSize: 52,
          rows: 15,
        },
      },
      'heading',
    ),
    h2: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 28,
          rows: 10,
        },
        tablet: {
          fontSize: 38,
          rows: 12,
        },
        desktop: {
          fontSize: 38,
          rows: 12,
        },
      },
      'heading',
    ),
    h3: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 24,
          rows: 8,
        },
        tablet: {
          fontSize: 30,
          rows: 10,
        },
        desktop: {
          fontSize: 30,
          rows: 10,
        },
      },
      'heading',
    ),
    h4: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 22,
          rows: 8,
        },
        tablet: {
          fontSize: 22,
          rows: 9,
        },
        desktop: {
          fontSize: 22,
          rows: 9,
        },
      },
      'heading',
    ),
  },
  text: {
    standard: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 18,
          rows: 9,
        },
        tablet: {
          fontSize: 20,
          rows: 10,
        },
        desktop: {
          fontSize: 20,
          rows: 10,
        },
      },
      'body',
    ),
    code: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 14,
          rows: 6,
        },
        tablet: {
          fontSize: 16,
          rows: 8,
        },
        desktop: {
          fontSize: 16,
          rows: 8,
        },
      },
      'body',
    ),
    small: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 16,
          rows: 8,
        },
        tablet: {
          fontSize: 16,
          rows: 8,
        },
        desktop: {
          fontSize: 16,
          rows: 8,
        },
      },
      'body',
    ),
    xsmall: calculateTypographyStyles(
      {
        mobile: {
          fontSize: 15,
          rows: 7,
        },
        tablet: {
          fontSize: 15,
          rows: 7,
        },
        desktop: {
          fontSize: 15,
          rows: 7,
        },
      },
      'body',
    ),
  },
  weight: {
    regular: '400',
    strong: '700',
  },
  palette: tailwindPalette,
  border: {
    width: {
      standard: px(1 * grid),
      large: px(2 * grid),
    },
    radius: {
      small: px(2 * grid),
      medium: px(4 * grid),
      large: px(7 * grid),
      full: '9999px',
    },
  },
});
