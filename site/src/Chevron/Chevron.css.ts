import { style } from '@vanilla-extract/css';

export const root = style({
  transition: 'transform .15s ease',
  position: 'relative',
  top: '1px',
});

export const direction = {
  down: null,
  up: style({ transform: 'rotate(180deg)' }),
  left: style({ transform: 'rotate(90deg)' }),
  right: style({ transform: 'rotate(270deg)' }),
};
