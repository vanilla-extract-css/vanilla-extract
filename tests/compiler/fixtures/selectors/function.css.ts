import { style } from '@vanilla-extract/css';

export const child = style({
  background: 'blue',
  selectors: () => ({
    [`${parent} &`]: {
      color: 'red',
    },
  }),
});

export const parent = style({
  background: 'yellow',
  selectors: {
    [`&:has(${child})`]: {
      padding: '10px',
    },
  },
});
