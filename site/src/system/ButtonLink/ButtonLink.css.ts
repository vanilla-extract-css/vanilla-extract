import { style } from '@vanilla-extract/css';
import { vars } from '../../themes.css';
import { darkMode } from '../styles/atoms.css';

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
  ':focus-visible': {
    boxShadow: `0px 0px 0px 5px ${vars.palette.pink400}`,
  },
  selectors: {
    [`.${darkMode} &:focus-visible`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink500}`,
    },
  },
});

export const transparent = style({
  boxShadow: `0 0 0 2px inset currentColor`,
  ':hover': { background: 'rgba(255,255,255,.5)' },
  ':focus-visible': {
    boxShadow: `0px 0px 0px 5px ${vars.palette.pink400},0 0 0 2px inset currentColor`,
  },
  selectors: {
    [`.${darkMode} &:hover`]: { background: 'rgba(255,255,255,.1)' },
    [`.${darkMode} &:focus-visible`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink500},0 0 0 2px inset currentColor`,
    },
  },
});
