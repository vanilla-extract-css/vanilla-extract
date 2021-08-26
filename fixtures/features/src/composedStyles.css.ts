import { globalStyle, style } from '@vanilla-extract/css';

export const mergedStyle = style([
  { height: 50, ':after': { display: 'block', content: '"Below 700px"' } },
  {
    '@media': {
      'screen and (min-width: 700px)': {
        ':after': { content: '"Above 700px"' },
      },
    },
  },
  {
    '@media': {
      'screen and (min-width: 700px)': {
        color: 'plum',
      },
    },
  },
]);

export const styleWithComposition = style([
  { backgroundColor: 'powderblue' },
  mergedStyle,
  { selectors: { '&:hover': { backgroundColor: 'slategray' } } },
]);

export const compositionOnly = style([mergedStyle, styleWithComposition]);

// Force composition for use in selector
export const compositionInSelector = style([
  style({ color: 'white' }),
  style({ backgroundColor: 'black' }),
]);

globalStyle(`body ${compositionInSelector}`, {
  fontSize: '24px',
});
