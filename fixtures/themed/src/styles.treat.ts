import {
  style,
  mapToStyles,
  createVar,
  fallbackVar,
} from '@mattsjones/css-core';
import { shadow } from './shared.treat';
import { vars, theme, altTheme } from './themes.treat';

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

export const button = [
  style({
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
        outline: '5px solid red',
      },
    },
  }),
  shadow,
];

const undefinedVar1 = createVar();
const undefinedVar2 = createVar();

export const opacity = mapToStyles(
  {
    '1/2': fallbackVar(undefinedVar1, 0.5),
    '1/4': fallbackVar(undefinedVar1, undefinedVar2, 0.25),
  },
  (value) => ({ opacity: value }),
);
