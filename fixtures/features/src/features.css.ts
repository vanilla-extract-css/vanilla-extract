import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

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

export const styleVariantsWithComposition = styleVariants({
  variant: [
    { backgroundColor: 'powderblue' },
    mergedStyle,
    { selectors: { '&:hover': { backgroundColor: 'slategray' } } },
  ],
});

export const styleVariantsWithMappedComposition = styleVariants(
  { variant: 'slategray' },
  (backgroundColor) => [
    { backgroundColor: 'powderblue' },
    mergedStyle,
    { selectors: { '&:hover': { backgroundColor } } },
  ],
);

export const compositionOnly = style([mergedStyle, styleWithComposition]);

// Force composition for use in selector
export const styleCompositionInSelector = style([
  style({ color: 'white' }),
  style({ backgroundColor: 'black' }),
]);

globalStyle(`body ${styleCompositionInSelector}`, {
  fontSize: '24px',
});

export const styleVariantsCompositionInSelector = styleVariants({
  variant: [style({ color: 'white' }), style({ backgroundColor: 'black' })],
});

globalStyle(`body ${styleVariantsCompositionInSelector.variant}`, {
  fontSize: '24px',
});

// Style with starting-style
export const styleWithStartingStyle = style({
  backgroundColor: 'black',
  '@starting-style': {
    backgroundColor: 'white',
  },
});
