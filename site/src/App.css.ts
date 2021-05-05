import { globalStyle } from '@vanilla-extract/css';
import { darkMode } from './system/styles/atoms.css';
import { vars } from './themes.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
});

globalStyle(`.${darkMode}`, {
  background: vars.palette.gray900,
  color: vars.palette.gray50,
});
globalStyle('html', {
  background: vars.palette.white,
  color: vars.palette.gray900,
});

globalStyle(`*`, {
  scrollbarColor: `${vars.palette.gray400} ${vars.palette.white}`,
  scrollbarWidth: 'thin',
});
globalStyle(`.${darkMode}, .${darkMode} *`, {
  scrollbarColor: `${vars.palette.gray500} ${vars.palette.gray900}`,
});

globalStyle(`*::-webkit-scrollbar`, {
  borderRadius: vars.border.radius.small,
  width: vars.spacing.small,
  height: vars.spacing.small,
});
globalStyle(`*::-webkit-scrollbar-track`, {
  backgroundColor: vars.palette.white,
  borderRadius: vars.border.radius.small,
});
globalStyle(`*::-webkit-scrollbar-thumb`, {
  backgroundColor: vars.palette.gray400,
  borderRadius: vars.border.radius.small,
});
globalStyle(`.${darkMode} *::-webkit-scrollbar-track`, {
  backgroundColor: vars.palette.gray900,
});
globalStyle(`.${darkMode} *::-webkit-scrollbar-thumb`, {
  backgroundColor: vars.palette.gray500,
});
