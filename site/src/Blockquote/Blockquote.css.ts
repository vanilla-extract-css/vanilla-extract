import { globalStyle, style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles';
import { vars } from '../themes.css';

export const root = style({
  '::before': {
    content: '""',
    position: 'absolute',
    background: vars.palette.pink100,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    transform: 'skewX(-2deg) skewY(-0.75deg)',
  },
  selectors: {
    [`.${darkMode} &::before`]: {
      background: vars.palette.blueGray900,
    },
  },
});

globalStyle(`${root} code`, {
  background: vars.palette.pink200,
  color: 'inherit',
});

globalStyle(`.${darkMode} ${root} code`, {
  background: vars.palette.blueGray800,
  color: 'inherit',
});
