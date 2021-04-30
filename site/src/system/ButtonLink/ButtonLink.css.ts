import { style } from '@vanilla-extract/css';
import { vars } from '../../themes.css';
import { darkMode, lightMode } from '../styles/atoms.css';

export const button = style({
  textDecoration: 'none',
  fontSize: vars.text.standard.mobile.fontSize,
  fontFamily: vars.fonts.body,
  transition: 'transform .15s ease',
  ':active': {
    transform: 'scale(.98) translateZ(0)',
  },
  ':focus': {
    outline: 'none',
  },
});

export const solid = style({
  boxShadow: `0px 0px 12px 0px rgba(0,0,0,0.4)`,
  selectors: {
    [`.${lightMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink500}`,
    },
    [`.${darkMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink600}`,
    },
  },
});

export const transparent = style({
  boxShadow: `0 0 0 2px inset currentColor`,
  selectors: {
    [`.${lightMode} &:hover`]: { background: 'rgba(255,255,255,.5)' },
    [`.${darkMode} &:hover`]: { background: 'rgba(255,255,255,.1)' },
    [`.${lightMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink500},0 0 0 2px inset currentColor`,
    },
    [`.${darkMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink600},0 0 0 2px inset currentColor`,
    },
  },
});
