// adapted from https://github.com/sindresorhus/round-to
function roundTo(number: number, precision: number) {
  if (typeof number !== 'number') {
    throw new TypeError('Expected value to be a number');
  }

  if (precision === Infinity) {
    return number;
  }

  if (!Number.isInteger(precision)) {
    throw new TypeError('Expected precision to be an integer');
  }

  const isNegative = number < 0;
  const inputNumber = isNegative ? Math.abs(number) : number;

  const power = 10 ** precision;
  const result =
    Math.round(Number((inputNumber * power).toPrecision(15))) / power;

  return isNegative ? -result : result;
}

export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

export interface CapsizeStyles {
  fontSize: string;
  lineHeight: string;
  '::before': {
    content: string;
    marginBottom: string;
    display: string;
  };
  '::after': {
    content: string;
    marginTop: string;
    display: string;
  };
}

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetrics;
};

type CapHeightWithLineGap = {
  capHeight: number;
  lineGap: number;
  fontMetrics: FontMetrics;
};

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetrics;
};

type FontSizeWithLineGap = {
  fontSize: number;
  lineGap: number;
  fontMetrics: FontMetrics;
};

export type CapsizeOptions =
  | CapHeightWithLineGap
  | CapHeightWithLeading
  | FontSizeWithLineGap
  | FontSizeWithLeading;

/*
   Rounding all values to a precision of `4` based on discovering that browser
   implementations of layout units fall between 1/60th and 1/64th of a pixel.

   Reference: https://trac.webkit.org/wiki/LayoutUnit
   (above wiki also mentions Mozilla - https://trac.webkit.org/wiki/LayoutUnit#Notes)
*/
const PRECISION = 4;

function normaliseOptions(options: CapsizeOptions) {
  if ('leading' in options && 'lineGap' in options) {
    throw new Error(
      'Only a single line height style can be provided. Please pass either `lineGap` OR `leading`.',
    );
  }

  if ('capHeight' in options && 'fontSize' in options) {
    throw new Error('Please pass either `capHeight` OR `fontSize`, not both.');
  }

  const { fontMetrics } = options;
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;

  let specifiedFontSize;
  let specifiedCapHeight;

  if ('capHeight' in options) {
    specifiedFontSize = options.capHeight / capHeightScale;
    specifiedCapHeight = options.capHeight;
  } else if ('fontSize' in options) {
    specifiedFontSize = options.fontSize;
    specifiedCapHeight = options.fontSize * capHeightScale;
  } else {
    throw new Error('Please pass either `capHeight` OR `fontSize`.');
  }

  let specifiedLineHeight;

  if ('lineGap' in options) {
    specifiedLineHeight = specifiedCapHeight + options.lineGap;
  } else if ('leading' in options) {
    specifiedLineHeight = options.leading;
  }

  return {
    fontSize: specifiedFontSize,
    lineHeight: specifiedLineHeight,
    fontMetrics,
  };
}

type CapsizeValues = {
  fontSize: string;
  // capHeight: string;
  lineHeight: string;
  capHeightTrim: string;
  baselineTrim: string;
};

function _computeValues(options: CapsizeOptions) {
  const { fontSize, lineHeight, fontMetrics } = normaliseOptions(options);

  const toScale = (value: number) => value / fontSize;

  const absoluteDescent = Math.abs(fontMetrics.descent);
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const descentScale = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm;
  const lineGapScale = fontMetrics.lineGap / fontMetrics.unitsPerEm;

  const contentArea =
    fontMetrics.ascent + fontMetrics.lineGap + absoluteDescent;
  const lineHeightScale = contentArea / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;

  const specifiedLineHeightOffset = lineHeight
    ? (lineHeightNormal - lineHeight) / 2
    : 0;

  const leadingTrim = (value: number) =>
    value - toScale(specifiedLineHeightOffset);

  return {
    fontSize: `${roundTo(fontSize, PRECISION)}px`,
    // capHeight: `${getCapHeight({ fontSize, fontMetrics })}px`,
    lineHeight: lineHeight ? `${roundTo(lineHeight, PRECISION)}px` : 'normal',
    capHeightTrim: `${roundTo(
      leadingTrim(ascentScale - capHeightScale + lineGapScale / 2) * -1,
      PRECISION,
    )}em`,
    baselineTrim: `${roundTo(
      leadingTrim(descentScale + lineGapScale / 2) * -1,
      PRECISION,
    )}em`,
  };
}

export function computeValues(options: CapHeightWithLeading): CapsizeValues;
export function computeValues(options: CapHeightWithLineGap): CapsizeValues;
export function computeValues(options: FontSizeWithLineGap): CapsizeValues;
export function computeValues(options: FontSizeWithLeading): CapsizeValues;
export function computeValues(options: CapsizeOptions) {
  return _computeValues(options);
}

function capsize(options: CapHeightWithLeading): CapsizeStyles;
function capsize(options: CapHeightWithLineGap): CapsizeStyles;
function capsize(options: FontSizeWithLineGap): CapsizeStyles;
function capsize(options: FontSizeWithLeading): CapsizeStyles;
function capsize(options: CapsizeOptions) {
  return createCss(_computeValues(options));
}

export function createCss({
  lineHeight,
  fontSize,
  capHeightTrim,
  baselineTrim,
}: CapsizeValues): CapsizeStyles {
  return {
    fontSize,
    lineHeight,
    '::before': {
      content: "''",
      marginBottom: capHeightTrim,
      display: 'table',
    },
    '::after': {
      content: "''",
      marginTop: baselineTrim,
      display: 'table',
    },
  };
}

export default capsize;

export const getCapHeight = ({
  fontSize,
  fontMetrics,
}: {
  fontSize: number;
  fontMetrics: FontMetrics;
}) =>
  roundTo(
    (fontSize * fontMetrics.capHeight) / fontMetrics.unitsPerEm,
    PRECISION,
  );
