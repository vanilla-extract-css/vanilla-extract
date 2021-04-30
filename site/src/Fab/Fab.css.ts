import { style } from '@vanilla-extract/css';
import { darkMode, lightMode } from '../system/styles/atoms.css';
import { vars } from '../themes.css';

const fabSize = 44;
export const fab = style({
  cursor: 'pointer',
  outline: 'none',
  height: fabSize,
  width: fabSize,
  zIndex: 3,
  boxShadow: '0 4px 8px rgba(14, 14, 33, 0.2)',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  selectors: {
    [`.${lightMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink500}`,
    },
    [`.${darkMode} &:focus`]: {
      boxShadow: `0px 0px 0px 5px ${vars.palette.pink600}`,
    },
  },
});

export const fab_isOpen = style({});

const barHeight = 3;
const barSpace = 4;
const barPosition = {
  1: fabSize / 2 - Math.floor(barHeight / 2) - barHeight - barSpace,
  2: fabSize / 2 - Math.floor(barHeight / 2),
  3: fabSize / 2 - Math.floor(barHeight / 2) + barHeight + barSpace,
};
export const fab__bar = style({
  left: 12,
  right: 12,
  height: 3,
  transition: 'transform .1s ease, opacity .1s ease',
  selectors: {
    '&:nth-child(1)': {
      top: barPosition['1'],
    },
    [`${fab_isOpen} &:nth-child(1)`]: {
      transform: `translateY(${
        barPosition['2'] - barPosition['1']
      }px) rotate(45deg)`,
    },
    '&:nth-child(2)': {
      top: barPosition['2'],
      left: 18,
    },
    [`${fab_isOpen} &:nth-child(2)`]: {
      opacity: 0,
    },
    '&:nth-child(3)': {
      top: barPosition['3'],
    },
    [`${fab_isOpen} &:nth-child(3)`]: {
      transform: `translateY(${
        barPosition['2'] - barPosition['3']
      }px) rotate(-45deg)`,
    },
  },
});
