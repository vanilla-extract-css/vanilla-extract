import { style } from '@vanilla-extract/css';
import { darkMode } from '../system/styles';
import { vars } from '../themes.css';

export const code = style({
  fontFamily: vars.fonts.code,
  wordWrap: 'break-word',
  '::before': {
    content: '""',
    position: 'absolute',
    background: vars.palette.pink100,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
    margin: '2px 0',
    clipPath: 'polygon(0 0, 100% 0, calc(100% - 3px) 100%, 3px 100%)',
    transform: 'skewY(-0.25deg)',
  },
  selectors: {
    [`.${darkMode} &::before`]: {
      background: vars.palette.gray800,
    },
    [`a > &`]: {
      textDecoration: 'underline 0.05em',
    },
    ['a:hover > &']: {
      color: 'currentcolor',
    },
    ['a:focus > &']: {
      outline: 'none',
      color: 'currentcolor',
    },
  },
});
