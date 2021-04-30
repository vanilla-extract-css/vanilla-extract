import { globalStyle } from '@vanilla-extract/css';
import { darkMode, lightMode } from './system/styles/atoms.css';
import { vars } from './themes.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
});

globalStyle(`body.${darkMode}`, {
  background: vars.palette.gray900,
  color: vars.palette.gray50,
});
globalStyle(`body.${lightMode}`, {
  background: vars.palette.white,
  color: vars.palette.gray900,
});
