type SimpleColorSpace =
  | 'srgb'
  | 'lab'
  | 'oklab'
  | 'xyz'
  | 'hsl'
  | 'hwb'
  | 'lch'
  | 'oklch';

type DashedColorSpace = 'srgb-linear' | 'xyz-d50' | 'xyz-d65';

type ColorSpace = SimpleColorSpace | DashedColorSpace;

type HueInterpolation = 'shorter' | 'longer' | 'increasing' | 'decreasing';
type Operand = string | ColorChain;

const colorSpaces: ColorSpace[] = [
  'srgb',
  'srgb-linear',
  'lab',
  'oklab',
  'xyz',
  'xyz-d50',
  'xyz-d65',
  'hsl',
  'hwb',
  'lch',
  'oklch',
];

const hueInterpolations: HueInterpolation[] = [
  'shorter',
  'longer',
  'increasing',
  'decreasing',
];

const toCamelCase = (str: string) =>
  str.replace(/-([a-z0-9])/g, (g) => g[1].toUpperCase());

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const colorMix = (
  colorSpace: ColorSpace,
  hueInterpolation: HueInterpolation | undefined,
  color1: Operand,
  color2: Operand,
  percentage?: number,
) => {
  const interpolationMethod = hueInterpolation
    ? `in ${colorSpace} ${hueInterpolation} hue`
    : `in ${colorSpace}`;

  const percentageStr = percentage !== undefined ? ` ${percentage}%` : '';

  return `color-mix(${interpolationMethod}, ${color1}${percentageStr}, ${color2})`;
};

type ColorMethod = (color: Operand, percentage?: number) => ColorChain;
type ColorFactory = (color: Operand) => ColorChain;

type BaseMethods = {
  srgb: ColorMethod;
  srgbLinear: ColorMethod;
  lab: ColorMethod;
  oklab: ColorMethod;
  xyz: ColorMethod;
  xyzD50: ColorMethod;
  xyzD65: ColorMethod;
  hsl: ColorMethod;
  hwb: ColorMethod;
  lch: ColorMethod;
  oklch: ColorMethod;
};

type HueMethods = {
  [K in `${'hsl' | 'hwb' | 'lch' | 'oklch'}${
    | 'Shorter'
    | 'Longer'
    | 'Increasing'
    | 'Decreasing'}`]: ColorMethod;
};

type ColorChain = {
  mix: ColorMethod;
  toString: () => string;
} & BaseMethods &
  HueMethods;

type Color = {
  [K in keyof BaseMethods]: ColorFactory;
} & {
  [K in keyof HueMethods]: ColorFactory;
};

const chain = (
  currentValue: string,
  lastColorSpace?: ColorSpace,
  lastHueInterpolation?: HueInterpolation,
): ColorChain => {
  const mixWith =
    (colorSpace: ColorSpace, hueInterpolation?: HueInterpolation) =>
    (color: Operand, percentage?: number) =>
      chain(
        colorMix(colorSpace, hueInterpolation, currentValue, color, percentage),
        colorSpace,
        hueInterpolation,
      );

  const methods: any = {
    mix: (color: Operand, percentage?: number) =>
      chain(
        colorMix(
          lastColorSpace || 'srgb',
          lastHueInterpolation,
          currentValue,
          color,
          percentage,
        ),
        lastColorSpace || 'srgb',
        lastHueInterpolation,
      ),
    toString: () => currentValue,
  };

  for (const space of colorSpaces) {
    const method = toCamelCase(space);
    methods[method] = mixWith(space);

    if (['hsl', 'hwb', 'lch', 'oklch'].includes(space)) {
      for (const hue of hueInterpolations) {
        methods[method + capitalize(hue)] = mixWith(space, hue);
      }
    }
  }

  return methods as ColorChain;
};

const colorImpl: any = {};

const addFactory = (
  name: string,
  space: ColorSpace,
  hue?: HueInterpolation,
) => {
  colorImpl[name] = (color: Operand) =>
    chain(typeof color === 'string' ? color : color.toString(), space, hue);
};

for (const space of colorSpaces) {
  const method = toCamelCase(space);
  addFactory(method, space);

  if (['hsl', 'hwb', 'lch', 'oklch'].includes(space)) {
    for (const hue of hueInterpolations) {
      addFactory(method + capitalize(hue), space, hue);
    }
  }
}

export const color: Color = colorImpl;
