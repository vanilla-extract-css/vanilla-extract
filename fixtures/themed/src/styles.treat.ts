import { style, mapToStyles } from '@mattsjones/css-core';
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
    backgroundColor: vars.colors.backgroundColor,
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

export const opacity = mapToStyles(
  {
    '1/2': 0.5,
    '1/4': 0.25,
  },
  (value) => ({ opacity: value }),
);
