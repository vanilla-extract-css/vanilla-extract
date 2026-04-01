import {
  createVar,
  globalStyle,
  positionTry,
  style,
  styleVariants,
} from '@vanilla-extract/css';

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

export const styleWithNestedComposition = style([
  { backgroundColor: 'powderblue' },
  [mergedStyle],
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

export const styleWithStartingStyle = style({
  backgroundColor: 'black',
  '@starting-style': {
    backgroundColor: 'white',
  },
});

const moveToBottom = positionTry({
  positionArea: 'bottom span-right',
  width: 150,
  margin: '10px 0 0 0',
});

// TODO: This needs to be an ident, not `var(--foo)` to work with positionAnchor
// Maybe we need to expose `createIdent` for this purpose?
// Would also be good for `positionTry`
const anchorName = createVar();

export const anchorElement = style({
  anchorName: anchorName,
  backgroundColor: 'coral',
  width: 150,
  height: 50,
  textAlign: 'center',
  lineHeight: '50px',
  marginTop: 40,
  marginLeft: 'auto',
  marginRight: 'auto',
});

export const anchoredElement = style({
  positionAnchor: anchorName,
  position: 'fixed',
  positionArea: 'right center',
  width: 200,
  margin: '0 0 0 10px',
  positionTryFallbacks: moveToBottom,
  backgroundColor: 'lightblue',
  padding: 10,
  textAlign: 'center',
});
