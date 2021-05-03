import { style } from '@vanilla-extract/css';

export const sectionLinkTitle = style({
  textTransform: 'uppercase',
});

export const active = style({});

export const activeIndicator = style({
  transition: 'transform .3s ease, opacity .3s ease',
  transform: 'skew(15deg)',
  selectors: {
    [`&:not(${active})`]: {
      transform: 'translateX(-80%)',
    },
  },
});
