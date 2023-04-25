import { style } from '@vanilla-extract/css';

export const legacyStyle = style({
  fontWeight: 'bold',
  ':after': {
    content: 'This is a legacy style',
  },
});

const px = (value: number) => `${value}px`;

const largeText = style({ fontSize: px(36) });

export { largeText as large };
