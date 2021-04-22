import {
  style,
  styleVariants,
  createVar,
  fallbackVar,
  fontFace,
  globalFontFace,
  keyframes,
  globalKeyframes,
} from '@vanilla-extract/css';
import { shadow } from './shared.css';
import { vars, theme, altTheme } from './themes.css';

const impact = fontFace({
  src: 'local("Impact")',
});

globalFontFace('MyGlobalComicSans', {
  src: 'local("Comic Sans MS")',
});

const slide = keyframes({
  '0%': {
    transform: 'translateY(-4px)',
  },
  '100%': {
    transform: 'translateY(4px)',
  },
});

globalKeyframes('globalSlide', {
  '0%': {
    transform: 'translateY(-4px)',
  },
  '100%': {
    transform: 'translateY(4px)',
  },
});

export const container = style({
  animation: `3s infinite alternate globalSlide ease-in-out`,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space[2],
  padding: vars.space[3],
  '@media': {
    'only screen and (min-width: 500px)': {
      border: `1px solid ${vars.colors.backgroundColor}`,
    },
  },
});

export const button = [
  style({
    animation: `3s infinite alternate ${slide} ease-in-out`,
    fontFamily: impact,
    backgroundColor: fallbackVar(
      vars.colors.backgroundColor,
      '"THIS FALLBACK VALUE SHOULD NEVER BE USED"',
    ),
    color: vars.colors.text,
    '@media': {
      'only screen and (min-width: 500px)': {
        borderRadius: '9999px',
      },
    },
    selectors: {
      [`${altTheme} ${theme} ${container} &`]: {
        fontFamily: 'MyGlobalComicSans',
        outline: '5px solid red',
      },
    },
  }),
  shadow,
];

const undefinedVar1 = createVar();
const undefinedVar2 = createVar();

export const opacity = styleVariants(
  {
    '1/2': fallbackVar(undefinedVar1, '0.5'),
    '1/4': fallbackVar(undefinedVar1, undefinedVar2, '0.25'),
  },
  (value) => ({ opacity: value }),
);
