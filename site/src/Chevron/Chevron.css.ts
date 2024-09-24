import { style, styleVariants } from '@vanilla-extract/css';

export const root = style({
  transition: 'transform .15s ease',
  position: 'relative',
  top: '1px',
});

export const direction = styleVariants({
  down: {},
  up: { transform: 'rotate(180deg)' },
  left: { transform: 'rotate(90deg)' },
  right: { transform: 'rotate(270deg)' },
});
