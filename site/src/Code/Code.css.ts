import { style, globalStyle } from '@vanilla-extract/css';
import { darkMode, lightMode } from '../system/styles/atoms.css';
import { vars } from '../themes.css';

export const root = style({
  overflowX: 'auto',
});

const tokenSelector = (mode: string, ...tokens: Array<string>) =>
  tokens.map((t) => `.${mode} ${root} .${t}`).join(', ');

globalStyle(`${root} code`, {
  padding: 0,
  margin: 0,
});

globalStyle(tokenSelector(lightMode, 'comment'), {
  color: vars.palette.gray500,
});
globalStyle(tokenSelector(lightMode, 'keyword', 'selector'), {
  color: vars.palette.blue200,
});
globalStyle(tokenSelector(lightMode, 'string'), {
  color: vars.palette.green200,
});
globalStyle(tokenSelector(lightMode, 'function', 'property'), {
  color: vars.palette.pink300,
});
globalStyle(tokenSelector(lightMode, 'punctuation', 'operator'), {
  color: vars.palette.gray400,
});

globalStyle(tokenSelector(darkMode, 'comment'), {
  color: vars.palette.gray500,
});
globalStyle(tokenSelector(darkMode, 'keyword', 'selector'), {
  color: vars.palette.blue300,
});
globalStyle(tokenSelector(darkMode, 'string'), {
  color: vars.palette.green300,
});
globalStyle(tokenSelector(darkMode, 'function', 'property'), {
  color: vars.palette.pink400,
});
globalStyle(tokenSelector(darkMode, 'punctuation', 'operator'), {
  color: vars.palette.gray400,
});

export const theme = {
  'pre[class*="language-"]': {
    whiteSpace: 'pre',
    margin: 0,
  },
};
