import { style } from '@vanilla-extract/css';
import { sprinkles } from '../sprinkles.css';

export const app = style({
  display: 'flex',
  border: '3px solid hotpink',
  minHeight: '100vh',
  alignItems: 'stretch',
});

export const layout = style([
  sprinkles({
    background: {
      lightMode: 'green-500',
      darkMode: 'gray-900',
    },
    display: 'flex',
    placeItems: 'center',
    padding: '6x',
  }),
  {
    minWidth: '100%',
  },
]);

export const card = style([
  sprinkles({
    background: {
      lightMode: 'green-50',
      darkMode: 'gray-800',
    },
    borderRadius: {
      mobile: '4x',
      desktop: '5x',
    },
    padding: {
      mobile: '7x',
      desktop: '8x',
    },
  }),
  {
    transition: 'transform 4s ease-in-out',
    ':hover': {
      cursor: 'default',
      transform: 'scale(2) rotate(720deg)',
    },
  },
]);

export const column = sprinkles({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  gap: {
    mobile: '5x',
    desktop: '6x',
  },
});

export const heading = sprinkles({
  fontFamily: 'body',
  textAlign: 'center',
  typeSize: {
    mobile: '4x',
    tablet: '4x',
    desktop: '5x',
  },
});

export const subheading = sprinkles({
  fontFamily: 'body',
  color: {
    lightMode: 'green-700',
    darkMode: 'green-50',
  },
  textAlign: 'center',
  typeSize: {
    mobile: '2x',
    tablet: '3x',
    desktop: '4x',
  },
});
