import { style, createVar, keyframes, fallbackVar } from '@vanilla-extract/css';

const color = createVar();
const angle = createVar({
  syntax: '<angle>',
  inherits: false,
  initialValue: '0deg',
});

const angleKeyframes = keyframes({
  '100%': {
    vars: {
      [angle]: '360deg',
    },
  },
});

export const root = style({
  background: 'pink',
  color: 'blue',
  padding: '16px',
  transition: `opacity .1s ease, color .1s ease`, // Testing autoprefixer
  backgroundImage: `linear-gradient(${angle}, rgba(153, 70, 198, 0.35) 0%, rgba(28, 56, 240, 0.46) 100%)`,
  animation: `${angleKeyframes} 7s infinite ease-in-out both`,
  ':hover': {
    opacity: 0.8,
    color: color,
  },

  vars: {
    [color]: '#fef',
    [angle]: fallbackVar(angle, '138deg'),
  },
});
