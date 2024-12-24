import {
  style,
  styleVariants,
  createVar,
  fallbackVar,
  fontFace,
  globalFontFace,
  globalStyle,
} from '@vanilla-extract/css';
import { shadow } from './shared.css';
import { vars, theme, altTheme } from './themes.css';

const impact = fontFace({
  src: 'local("Impact")',
});

globalFontFace('MyGlobalComicSans', {
  src: 'local("Comic Sans MS")',
});

export const container = style({
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

const iDunno = style([{ zIndex: 1 }, { position: 'relative' }]);

export const button = style([
  {
    fontFamily: impact,
    backgroundColor: fallbackVar(
      vars.colors.backgroundColor,
      '"THIS FALLBACK VALUE SHOULD NEVER BE USED"',
    ),
    color: vars.colors.text,
    borderRadius: '9999px',
    '@media': {
      'only screen and (min-width: 500px)': {
        padding: vars.space[1],
      },
      'only screen and (min-width: 1000px)': {
        padding: vars.space[2],
      },
    },
    selectors: {
      [`${altTheme} ${theme} ${container} &`]: {
        fontFamily: 'MyGlobalComicSans',
        outline: '5px solid red',
      },
    },
  },
  shadow,
  iDunno,
]);

globalStyle(`body ${iDunno}:after`, {
  content: "'I am content'",
});

const blankVar1 = createVar({
  syntax: '<number>',
  inherits: false,
  initialValue: '0.5',
});
const blankVar2 = createVar();

export const opacity = styleVariants(
  {
    '1/2': blankVar1,
    '1/4': fallbackVar(blankVar1, blankVar2, '0.25'),
  },
  (value) => ({
    selectors: { 'html &': { opacity: value } },
  }),
);
