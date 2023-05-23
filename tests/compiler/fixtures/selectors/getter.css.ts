import { style } from '@vanilla-extract/css';

export const child = style({
  background: 'blue',
  get selectors() {
    return {
      [`${parent} &`]: {
        color: 'red',
      },
    };
  },
});

export const parent = style({
  background: 'yellow',
  selectors: {
    [`&:has(${child})`]: {
      padding: 10,
    },
  },
});
