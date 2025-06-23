import { createGlobalThemeContract, createTheme } from '@vanilla-extract/css';

/**
 * Figma’s Simple Design System
 * Licensed under Creative Commons Attribution 4.0
 * @see https://www.figma.com/community/file/1380235722331273046
 */

export const vars = createGlobalThemeContract({
  color: {
    black: {
      '100': 'color-black-100',
      '200': 'color-black-200',
      '300': 'color-black-300',
      '400': 'color-black-400',
      '500': 'color-black-500',
      '600': 'color-black-600',
      '700': 'color-black-700',
      '800': 'color-black-800',
      '900': 'color-black-900',
      '1000': 'color-black-1000',
    },
    brand: {
      '100': 'color-brand-100',
      '200': 'color-brand-200',
      '300': 'color-brand-300',
      '400': 'color-brand-400',
      '500': 'color-brand-500',
      '600': 'color-brand-600',
      '700': 'color-brand-700',
      '800': 'color-brand-800',
      '900': 'color-brand-900',
      '1000': 'color-brand-1000',
    },
    gray: {
      '100': 'color-gray-100',
      '200': 'color-gray-200',
      '300': 'color-gray-300',
      '400': 'color-gray-400',
      '500': 'color-gray-500',
      '600': 'color-gray-600',
      '700': 'color-gray-700',
      '800': 'color-gray-800',
      '900': 'color-gray-900',
      '1000': 'color-gray-1000',
    },
    green: {
      '100': 'color-green-100',
      '200': 'color-green-200',
      '300': 'color-green-300',
      '400': 'color-green-400',
      '500': 'color-green-500',
      '600': 'color-green-600',
      '700': 'color-green-700',
      '800': 'color-green-800',
      '900': 'color-green-900',
      '1000': 'color-green-1000',
    },
    pink: {
      '100': 'color-pink-100',
      '200': 'color-pink-200',
      '300': 'color-pink-300',
      '400': 'color-pink-400',
      '500': 'color-pink-500',
      '600': 'color-pink-600',
      '700': 'color-pink-700',
      '800': 'color-pink-800',
      '900': 'color-pink-900',
      '1000': 'color-pink-1000',
    },
    red: {
      '100': 'color-red-100',
      '200': 'color-red-200',
      '300': 'color-red-300',
      '400': 'color-red-400',
      '500': 'color-red-500',
      '600': 'color-red-600',
      '700': 'color-red-700',
      '800': 'color-red-800',
      '900': 'color-red-900',
      '1000': 'color-red-1000',
    },
    slate: {
      '100': 'color-slate-100',
      '200': 'color-slate-200',
      '300': 'color-slate-300',
      '400': 'color-slate-400',
      '500': 'color-slate-500',
      '600': 'color-slate-600',
      '700': 'color-slate-700',
      '800': 'color-slate-800',
      '900': 'color-slate-900',
      '1000': 'color-slate-1000',
    },
    white: {
      '100': 'color-white-100',
      '200': 'color-white-200',
      '300': 'color-white-300',
      '400': 'color-white-400',
      '500': 'color-white-500',
      '600': 'color-white-600',
      '700': 'color-white-700',
      '800': 'color-white-800',
      '900': 'color-white-900',
      '1000': 'color-white-1000',
    },
    yellow: {
      '100': 'color-yellow-100',
      '200': 'color-yellow-200',
      '300': 'color-yellow-300',
      '400': 'color-yellow-400',
      '500': 'color-yellow-500',
      '600': 'color-yellow-600',
      '700': 'color-yellow-700',
      '800': 'color-yellow-800',
      '900': 'color-yellow-900',
      '1000': 'color-yellow-1000',
    },
    background: {
      brand: 'color-background-brand-default',
      default: 'color-background-default-default',
    },
    border: {
      default: 'color-border-default-default',
    },
    text: {
      brand: 'color-text-brand-default',
      default: 'color-text-default-default',
    },
  },
  size: {
    blur: {
      '100': 'size-blur-100',
    },
    depth: {
      '0': 'size-depth-0',
      '025': 'size-depth-025',
      '100': 'size-depth-100',
      '200': 'size-depth-200',
      '400': 'size-depth-400',
      '800': 'size-depth-800',
      '1200': 'size-depth-1200',
      negative025: 'size-depth-negative-025',
      negative100: 'size-depth-negative-100',
      negative200: 'size-depth-negative-200',
      negative400: 'size-depth-negative-400',
      negative800: 'size-depth-negative-800',
      negative1200: 'size-depth-negative-1200',
    },
    icon: {
      small: 'size-icon-small',
      medium: 'size-icon-medium',
      large: 'size-icon-large',
    },
    radius: {
      '100': 'size-radius-100',
      '200': 'size-radius-200',
      '400': 'size-radius-400',
      full: 'size-radius-full',
    },
    space: {
      '0': 'size-space-0',
      '050': 'size-space-050',
      '100': 'size-space-100',
      '150': 'size-space-150',
      '200': 'size-space-200',
      '300': 'size-space-300',
      '400': 'size-space-400',
      '600': 'size-space-600',
      '800': 'size-space-800',
      '1200': 'size-space-1200',
      '1600': 'size-space-1600',
      '2400': 'size-space-2400',
      '4000': 'size-space-4000',
      negative100: 'size-space-negative-100',
      negative200: 'size-space-negative-200',
      negative300: 'size-space-negative-300',
      negative400: 'size-space-negative-400',
      negative600: 'size-space-negative-600',
    },
    stroke: {
      border: 'size-stroke-border',
      focusRing: 'size-stroke-focus-ring',
    },
  },
  typography: {
    body: {
      small: {
        fontFamily: 'typography-body-small-font-family',
        fontSize: 'typography-body-small-font-size',
        fontWeight: 'typography-body-small-font-weight',
      },
      medium: {
        fontFamily: 'typography-body-medium-font-family',
        fontSize: 'typography-body-medium-font-size',
        fontWeight: 'typography-body-medium-font-weight',
      },
      large: {
        fontFamily: 'typography-body-large-font-family',
        fontSize: 'typography-body-large-font-size',
        fontWeight: 'typography-body-large-font-weight',
      },
    },
    code: {
      small: {
        fontFamily: 'typography-code-small-font-family',
        fontSize: 'typography-code-small-font-size',
        fontWeight: 'typography-code-small-font-weight',
      },
      medium: {
        fontFamily: 'typography-code-medium-font-family',
        fontSize: 'typography-code-medium-font-size',
        fontWeight: 'typography-code-medium-font-weight',
      },
      large: {
        fontFamily: 'typography-code-large-font-family',
        fontSize: 'typography-code-large-font-size',
        fontWeight: 'typography-code-large-font-weight',
      },
    },
    family: {
      mono: 'typography-family-mono',
      sans: 'typography-family-sans',
      serif: 'typography-family-serif',
    },
    scale: {
      '10': 'typography-scale-10',
      '01': 'typography-scale-01',
      '02': 'typography-scale-02',
      '03': 'typography-scale-03',
      '04': 'typography-scale-04',
      '05': 'typography-scale-05',
      '06': 'typography-scale-06',
      '07': 'typography-scale-07',
      '08': 'typography-scale-08',
      '09': 'typography-scale-09',
    },
    weight: {
      thin: 'typography-weight-thin',
      extralight: 'typography-weight-extralight',
      light: 'typography-weight-light',
      regular: 'typography-weight-regular',
      medium: 'typography-weight-medium',
      semibold: 'typography-weight-semibold',
      bold: 'typography-weight-bold',
      extrabold: 'typography-weight-extrabold',
      black: 'typography-weight-black',
    },
  },
});

createTheme(vars, {
  color: {
    black: {
      '100':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.050980392156862744)',
      '200':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.10196078431372549)',
      '300':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.2)',
      '400':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.4)',
      '500':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.6980392156862745)',
      '600':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.8)',
      '700':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.8509803921568627)',
      '800':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.8980392156862745)',
      '900':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744 / 0.9490196078431372)',
      '1000':
        'color(srgb 0.047058823529411764 0.047058823529411764 0.050980392156862744)',
    },
    brand: {
      '100':
        'color(srgb 0.9607843137254902 0.9607843137254902 0.9607843137254902)',
      '200':
        'color(srgb 0.9019607843137255 0.9019607843137255 0.9019607843137255)',
      '300':
        'color(srgb 0.8509803921568627 0.8509803921568627 0.8509803921568627)',
      '400':
        'color(srgb 0.7019607843137254 0.7019607843137254 0.7019607843137254)',
      '500':
        'color(srgb 0.4588235294117647 0.4588235294117647 0.4588235294117647)',
      '600':
        'color(srgb 0.26666666666666666 0.26666666666666666 0.26666666666666666)',
      '700':
        'color(srgb 0.2196078431372549 0.2196078431372549 0.2196078431372549)',
      '800':
        'color(srgb 0.17254901960784313 0.17254901960784313 0.17254901960784313)',
      '900':
        'color(srgb 0.11764705882352941 0.11764705882352941 0.11764705882352941)',
      '1000':
        'color(srgb 0.06666666666666667 0.06666666666666667 0.06666666666666667)',
    },
    gray: {
      '100':
        'color(srgb 0.9607843137254902 0.9607843137254902 0.9607843137254902)',
      '200':
        'color(srgb 0.9019607843137255 0.9019607843137255 0.9019607843137255)',
      '300':
        'color(srgb 0.8509803921568627 0.8509803921568627 0.8509803921568627)',
      '400':
        'color(srgb 0.7019607843137254 0.7019607843137254 0.7019607843137254)',
      '500':
        'color(srgb 0.4588235294117647 0.4588235294117647 0.4588235294117647)',
      '600':
        'color(srgb 0.26666666666666666 0.26666666666666666 0.26666666666666666)',
      '700':
        'color(srgb 0.2196078431372549 0.2196078431372549 0.2196078431372549)',
      '800':
        'color(srgb 0.17254901960784313 0.17254901960784313 0.17254901960784313)',
      '900':
        'color(srgb 0.11764705882352941 0.11764705882352941 0.11764705882352941)',
      '1000':
        'color(srgb 0.06666666666666667 0.06666666666666667 0.06666666666666667)',
    },
    green: {
      '100': 'color(srgb 0.9215686274509803 1 0.9333333333333333)',
      '200':
        'color(srgb 0.8117647058823529 0.9686274509803922 0.8274509803921568)',
      '300':
        'color(srgb 0.6862745098039216 0.9568627450980393 0.7764705882352941)',
      '400':
        'color(srgb 0.5215686274509804 0.8784313725490196 0.6392156862745098)',
      '500':
        'color(srgb 0.0784313725490196 0.6823529411764706 0.3607843137254902)',
      '600': 'color(srgb 0 0.6 0.3176470588235294)',
      '700': 'color(srgb 0 0.5019607843137255 0.2627450980392157)',
      '800':
        'color(srgb 0.00784313725490196 0.32941176470588235 0.17647058823529413)',
      '900':
        'color(srgb 0.00784313725490196 0.25098039215686274 0.13725490196078433)',
      '1000':
        'color(srgb 0.023529411764705882 0.17647058823529413 0.10588235294117647)',
    },
    pink: {
      '100':
        'color(srgb 0.9882352941176471 0.9450980392156862 0.9921568627450981)',
      '200':
        'color(srgb 0.9803921568627451 0.8823529411764706 0.9803921568627451)',
      '300':
        'color(srgb 0.9607843137254902 0.7529411764705882 0.9372549019607843)',
      '400':
        'color(srgb 0.9450980392156862 0.6196078431372549 0.8627450980392157)',
      '500':
        'color(srgb 0.9176470588235294 0.24705882352941178 0.7215686274509804)',
      '600':
        'color(srgb 0.8431372549019608 0.19607843137254902 0.6588235294117647)',
      '700':
        'color(srgb 0.7294117647058823 0.16470588235294117 0.5725490196078431)',
      '800':
        'color(srgb 0.5411764705882353 0.13333333333333333 0.43529411764705883)',
      '900':
        'color(srgb 0.3411764705882353 0.09411764705882353 0.2901960784313726)',
      '1000':
        'color(srgb 0.24705882352941178 0.08235294117647059 0.21176470588235294)',
    },
    red: {
      '100':
        'color(srgb 0.996078431372549 0.9137254901960784 0.9058823529411765)',
      '200':
        'color(srgb 0.9921568627450981 0.8274509803921568 0.8156862745098039)',
      '300':
        'color(srgb 0.9882352941176471 0.7019607843137254 0.6784313725490196)',
      '400':
        'color(srgb 0.9568627450980393 0.4666666666666667 0.41568627450980394)',
      '500':
        'color(srgb 0.9254901960784314 0.13333333333333333 0.12156862745098039)',
      '600':
        'color(srgb 0.7529411764705882 0.058823529411764705 0.047058823529411764)',
      '700':
        'color(srgb 0.5647058823529412 0.043137254901960784 0.03529411764705882)',
      '800':
        'color(srgb 0.4117647058823529 0.03137254901960784 0.027450980392156862)',
      '900':
        'color(srgb 0.30196078431372547 0.043137254901960784 0.0392156862745098)',
      '1000':
        'color(srgb 0.18823529411764706 0.023529411764705882 0.011764705882352941)',
    },
    slate: {
      '100':
        'color(srgb 0.9529411764705882 0.9529411764705882 0.9529411764705882)',
      '200':
        'color(srgb 0.8901960784313725 0.8901960784313725 0.8901960784313725)',
      '300':
        'color(srgb 0.803921568627451 0.803921568627451 0.803921568627451)',
      '400':
        'color(srgb 0.6980392156862745 0.6980392156862745 0.6980392156862745)',
      '500':
        'color(srgb 0.5803921568627451 0.5803921568627451 0.5803921568627451)',
      '600':
        'color(srgb 0.4627450980392157 0.4627450980392157 0.4627450980392157)',
      '700':
        'color(srgb 0.35294117647058826 0.35294117647058826 0.35294117647058826)',
      '800':
        'color(srgb 0.2627450980392157 0.2627450980392157 0.2627450980392157)',
      '900':
        'color(srgb 0.18823529411764706 0.18823529411764706 0.18823529411764706)',
      '1000':
        'color(srgb 0.1411764705882353 0.1411764705882353 0.1411764705882353)',
    },
    white: {
      '100': 'color(srgb 1 1 1 / 0.050980392156862744)',
      '200': 'color(srgb 1 1 1 / 0.10196078431372549)',
      '300': 'color(srgb 1 1 1 / 0.2)',
      '400': 'color(srgb 1 1 1 / 0.4)',
      '500': 'color(srgb 1 1 1 / 0.6980392156862745)',
      '600': 'color(srgb 1 1 1 / 0.8)',
      '700': 'color(srgb 1 1 1 / 0.8509803921568627)',
      '800': 'color(srgb 1 1 1 / 0.8980392156862745)',
      '900': 'color(srgb 1 1 1 / 0.9490196078431372)',
      '1000': 'color(srgb 1 1 1)',
    },
    yellow: {
      '100': 'color(srgb 1 0.984313725490196 0.9215686274509803)',
      '200': 'color(srgb 1 0.9450980392156862 0.7607843137254902)',
      '300': 'color(srgb 1 0.9098039215686274 0.6392156862745098)',
      '400':
        'color(srgb 0.9098039215686274 0.7254901960784313 0.19215686274509805)',
      '500': 'color(srgb 0.8980392156862745 0.6274509803921569 0)',
      '600':
        'color(srgb 0.7490196078431373 0.41568627450980394 0.00784313725490196)',
      '700':
        'color(srgb 0.592156862745098 0.3176470588235294 0.00784313725490196)',
      '800':
        'color(srgb 0.40784313725490196 0.17647058823529413 0.011764705882352941)',
      '900':
        'color(srgb 0.3215686274509804 0.1450980392156863 0.01568627450980392)',
      '1000':
        'color(srgb 0.25098039215686274 0.10588235294117647 0.00392156862745098)',
    },
    background: {
      brand: vars.color.brand[800],
      default: vars.color.white[1000],
    },
    border: {
      default: vars.color.gray[300],
    },
    text: {
      brand: vars.color.brand[800],
      default: vars.color.gray[900],
    },
  },
  size: {
    blur: {
      '100': '0.25rem',
    },
    depth: {
      '0': '0',
      '025': '0.0625rem',
      '100': '0.25rem',
      '200': '0.5rem',
      '400': '1rem',
      '800': '2rem',
      '1200': '3rem',
      negative025: '-0.0625rem',
      negative100: '-0.25rem',
      negative200: '-0.5rem',
      negative400: '-1rem',
      negative800: '-2rem',
      negative1200: '-3rem',
    },
    icon: {
      small: '1.5rem',
      medium: '2rem',
      large: '2.5rem',
    },
    radius: {
      '100': '0.25rem',
      '200': '0.5rem',
      '400': '1rem',
      full: '624.9375rem',
    },
    space: {
      '0': '0',
      '050': '0.125rem',
      '100': '0.25rem',
      '150': '0.375rem',
      '200': '0.5rem',
      '300': '0.75rem',
      '400': '1rem',
      '600': '1.5rem',
      '800': '2rem',
      '1200': '3rem',
      '1600': '4rem',
      '2400': '6rem',
      '4000': '0',
      negative100: '-0.25rem',
      negative200: '-0.5rem',
      negative300: '-0.75rem',
      negative400: '-1rem',
      negative600: '-1.5rem',
    },
    stroke: {
      border: '0.0625rem',
      focusRing: '0.125rem',
    },
  },
  typography: {
    body: {
      small: {
        fontFamily: vars.typography.family.sans,
        fontSize: vars.typography.scale['02'],
        fontWeight: vars.typography.weight.regular,
      },
      medium: {
        fontFamily: vars.typography.family.sans,
        fontSize: vars.typography.scale['03'],
        fontWeight: vars.typography.weight.regular,
      },
      large: {
        fontFamily: vars.typography.family.sans,
        fontSize: vars.typography.scale['04'],
        fontWeight: vars.typography.weight.regular,
      },
    },
    code: {
      small: {
        fontFamily: vars.typography.family.mono,
        fontSize: vars.typography.scale['02'],
        fontWeight: vars.typography.weight.regular,
      },
      medium: {
        fontFamily: vars.typography.family.mono,
        fontSize: vars.typography.scale['03'],
        fontWeight: vars.typography.weight.regular,
      },
      large: {
        fontFamily: vars.typography.family.mono,
        fontSize: vars.typography.scale['04'],
        fontWeight: vars.typography.weight.regular,
      },
    },
    family: {
      mono: '"roboto mono", monospace',
      sans: 'inter, sans-serif',
      serif: '"noto serif", serif',
    },
    scale: {
      '01': '0.75rem',
      '02': '0.875rem',
      '03': '1rem',
      '04': '1.25rem',
      '05': '1.5rem',
      '06': '2rem',
      '07': '2.5rem',
      '08': '3rem',
      '09': '4rem',
      '10': '4.5rem',
    },
    weight: {
      thin: '100',
      extralight: '200',
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
  },
});
