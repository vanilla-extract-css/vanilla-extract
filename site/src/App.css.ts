import { globalStyle, createVar } from '@vanilla-extract/css';
import { darkMode } from './system/styles/atoms.css';
import { vars } from './themes.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  overflow: 'overlay',
});

globalStyle(`.${darkMode}`, {
  background: vars.palette.black,
  color: vars.palette.gray50,
});
globalStyle('html', {
  background: vars.palette.white,
  color: vars.palette.coolGray900,
});

const scrollBarColor = createVar();
const scrollBarTrackColor = createVar();

globalStyle(`*`, {
  vars: {
    [scrollBarColor]: vars.palette.coolGray400,
    [scrollBarTrackColor]: vars.palette.coolGray50,
  },
  scrollbarColor: `${scrollBarColor} ${scrollBarTrackColor}`,
  scrollbarWidth: 'thin',
});
globalStyle(`.${darkMode}, .${darkMode} *`, {
  vars: {
    [scrollBarColor]: vars.palette.gray600,
    [scrollBarTrackColor]: vars.palette.gray900,
  },
});
globalStyle(`*::-webkit-scrollbar`, {
  width: vars.spacing.small,
  height: vars.spacing.small,
});
globalStyle(`*::-webkit-scrollbar-thumb`, {
  backgroundColor: scrollBarColor,
  borderRadius: vars.border.radius.small,
});
