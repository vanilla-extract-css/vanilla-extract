import { globalStyle } from '@vanilla-extract/css';
import { darkMode } from './system/styles/sprinkles.css';
import { vars } from './themes.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
});

globalStyle(`.${darkMode}`, {
  background: vars.palette.black,
  color: vars.palette.zinc50,
  colorScheme: 'dark',
});

globalStyle('html', {
  background: vars.palette.white,
  color: vars.palette.gray900,
});
