import { assignVars, style, globalStyle } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';
import { shikiVars } from './shikiVars.css';

interface Colors {
  base: string;
  subtle: string;
  blue: string;
  green: string;
  pink: string;
}

const shikiColors = ({ base, subtle, blue, green, pink }: Colors) =>
  assignVars(shikiVars, {
    foreground: base,
    token: {
      constant: base,
      parameter: base,
      keyword: blue,
      link: blue,
      string: green,
      'string-expression': green,
      comment: subtle,
      punctuation: subtle,
      function: pink,
    },
  });

export const root = style({
  overflowX: 'auto',
  vars: shikiColors({
    base: vars.palette.blue800,
    subtle: vars.palette.gray400,
    blue: vars.palette.blue600,
    green: vars.palette.green600,
    pink: vars.palette.pink600,
  }),
  selectors: {
    [`.${darkMode} &`]: {
      vars: shikiColors({
        base: vars.palette.white,
        subtle: vars.palette.zinc400,
        blue: vars.palette.blue300,
        green: vars.palette.green300,
        pink: vars.palette.pink400,
      }),
    },
  },
});

globalStyle(`${root} pre, ${root} code`, {
  fontFamily: vars.fonts.code,
  padding: 0,
  margin: 0,
});
