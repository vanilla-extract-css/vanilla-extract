import { style, globalStyle, createThemeContract, assignVars } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

const themeVars = createThemeContract({
  base: null,
  subtle: null,
  blue: null,
  green: null,
  pink: null
});

const lightVars = assignVars(themeVars, {
  base: vars.palette.coolGray500,
  subtle: vars.palette.coolGray400,
  blue: vars.palette.blue600,
  green: vars.palette.green600,
  pink: vars.palette.pink600
});

const darkVars = assignVars(themeVars, {
  base: vars.palette.white,
  subtle: vars.palette.gray400,
  blue: vars.palette.blue300,
  green: vars.palette.green300,
  pink: vars.palette.pink400
});

export const root = style([
  {
    overflowX: 'auto',
    selectors: {
      [`:not(.${darkMode}) &`]: {
        vars: lightVars
      },
      [`.${darkMode} &`]: {
        vars: darkVars
      }
    }
  }
]);

const scopeSelectors = (tokens: Array<string>) =>
  tokens
    .map((t) => `${root} ${t}`)
    .join(', ');

globalStyle(scopeSelectors(['pre', 'code']), {
  fontFamily: vars.fonts.code,
  padding: 0,
  margin: 0,
});
globalStyle(scopeSelectors(['code', '.attr-name', '.property']), {
  color: themeVars.base
});
globalStyle(scopeSelectors(['.comment', '.tag', '.punctuation', '.operator']), {
  color: themeVars.subtle,
});
globalStyle(scopeSelectors(['.language-css', '.string']), {
  color: themeVars.green
});
globalStyle(scopeSelectors(['.language-css .function', '.language-bash .function', '.selector', '.number', '.keyword']), {
  color: themeVars.blue,
});
globalStyle(scopeSelectors(['.function', '.unit']), {
  color: themeVars.pink,
});
