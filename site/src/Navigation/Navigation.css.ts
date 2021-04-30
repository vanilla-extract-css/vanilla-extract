import { style } from '@vanilla-extract/css';

export const sectionLinkTitle = style({
  textTransform: 'uppercase',
});

export const active = style({});

export const activeIndicator = style({
  transition: 'transform .3s ease, opacity .3s ease',
  clipPath: 'polygon(0 0, 84% 0, 100% 100%, 6% 100%)',
  selectors: {
    [`&:not(${active})`]: {
      transform: 'translateX(-80%)',
    },
  },
});
