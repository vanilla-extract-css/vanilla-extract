import {
  createVar,
  fallbackVar,
  style,
  type StyleRule,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { darkMode, sprinkles } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

export const darkModeBg = createVar();
export const lightModeBg = createVar();

export const root = style([
  sprinkles({ position: 'relative', zIndex: 0 }),
  {
    '::before': {
      content: '""',
      position: 'absolute',
      background: fallbackVar(lightModeBg, vars.palette.blue50),
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: -1,
      transform: 'skewX(-1deg) skewY(0.75deg)',
    },
    selectors: {
      [`.${darkMode} &::before`]: {
        background: fallbackVar(darkModeBg, vars.palette.zinc900),
      },
    },
  },
]);

const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  margin: 0,
  opacity: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
});

export const fileInput = style([visuallyHidden]);
// Covers the button, as clicking the button scrolls the checkbox into view
export const showCssInput = style([
  visuallyHidden,
  { inset: 0, width: '100%', height: '100%' },
]);

/** Only a single file, so it's always shown as active */
export const onlyFileTab = style({});

const backgroundColor = createVar();
export const fileTab = style({
  vars: {
    [backgroundColor]: vars.palette.gray900,
  },
  selectors: {
    [`${fileInput}:focus-visible + &`]: {
      boxShadow: `0 0 0 6px ${backgroundColor}, 0px 0px 0px 8px ${vars.palette.blue300}`,
    },
    [`.${darkMode} ${fileInput}:focus-visible + &`]: {
      vars: {
        [backgroundColor]: vars.palette.zinc900,
      },
    },
  },
});

const activeFileTab = `:is(${fileInput}:checked + ${fileTab}, ${onlyFileTab})`;

export const fileIndicator = style({
  transform: 'skew(-15deg)',
  filter: 'saturate(0)',
  opacity: 0.2,
  selectors: {
    [`${activeFileTab} &`]: {
      transform: 'skew(15deg)',
      filter: 'none',
      opacity: 1,
    },
  },
});

export const fileName = style({
  color: vars.palette.blue800,
  opacity: 0.7,
  selectors: {
    [`.${darkMode} &`]: {
      color: vars.palette.white,
    },
    [`${activeFileTab} &`]: {
      opacity: 1,
      fontWeight: vars.weight.strong,
    },
  },
});

export const filePanel = style({
  order: 1,
  selectors: {
    [`${fileInput}:not(:checked) + ${fileTab} + &`]: {
      display: 'none',
    },
  },
});

export const boldLayoutShiftFix = style({
  '::after': {
    content: ['attr(data-text)', 'attr(data-text) / ""'],
    fontWeight: vars.weight.strong,
    fontSize: vars.text.small.mobile.fontSize,
    lineHeight: vars.text.small.mobile.lineHeight,
    fontFamily: vars.fonts.body,
    opacity: 0,
    visibility: 'hidden',
    overflow: 'hidden',
    userSelect: 'none',
  },
  '@media': {
    speech: {
      '::after': {
        display: 'none',
      },
    },
  },
});

const sideBySideBreakpoint = 1000;

const sideBySideStyles = (styles: StyleRule): StyleRule => ({
  '@media': {
    [`screen and (min-width: ${sideBySideBreakpoint}px)`]: styles,
  },
});

const belowSideBySideStyles = (styles: StyleRule): StyleRule => ({
  '@media': {
    [`screen and (max-width: ${sideBySideBreakpoint - 1}px)`]: styles,
  },
});

export const maxHeight = style({
  maxHeight: 'min(65vh, 800px)',
  overflow: 'auto',
});

export const sourceContainer = style([
  maxHeight,
  {
    transformOrigin: '0 50%',
  },
  sideBySideStyles({
    width: 'auto',
    flexShrink: 1,
  }),
  {
    selectors: {
      [`${filePanel}:has(${showCssInput}:checked) &`]: belowSideBySideStyles({
        transform: `scale(.9)`,
        opacity: 0,
      }),
    },
  },
]);

export const outputContainer = style([
  {
    position: 'relative',
    '::before': {
      content: '""',
      position: 'absolute',
      background: vars.palette.blue100,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: -1,
      transform: 'skewX(.75deg) skewY(1.5deg)',
    },
    selectors: {
      [`.${darkMode} &::before`]: {
        background: vars.palette.black,
      },
    },
  },
  sideBySideStyles({
    width: '45%',
    flexGrow: 0,
    marginTop: calc(vars.spacing.medium).negate().toString(),
    marginBottom: calc(vars.spacing.large).negate().toString(),
    marginLeft: vars.spacing.large,
  }),
  belowSideBySideStyles({
    transform: 'scale(1.1) translateX(-82%)',
    flexGrow: 1,
    opacity: 0,
    pointerEvents: 'none',
  }),
  {
    selectors: {
      [`${filePanel}:has(${showCssInput}:checked) &`]: belowSideBySideStyles({
        transform: 'scale(1) translateX(-100%)',
        opacity: 1,
        pointerEvents: 'auto',
      }),
    },
  },
]);

export const buttonContainer = style(
  sideBySideStyles({
    display: 'none',
  }),
);

export const button = style({
  userSelect: 'none',
  outline: 'none',
  ':active': {
    transform: 'scale(.95) translateZ(0)',
    transformOrigin: '50% 50%',
  },
  selectors: {
    [`&:has(${showCssInput}:focus-visible)`]: {
      boxShadow: `0px 0px 0px 4px ${vars.palette.blue400}`,
    },
  },
});

export const buttonBackground = style({
  selectors: {
    [`${filePanel}:has(${showCssInput}:checked) &`]: { opacity: 0 },
  },
});

export const showOutputText = style({
  selectors: {
    [`${filePanel}:has(${showCssInput}:checked) &`]: { display: 'none' },
  },
});

export const closeText = style({
  selectors: {
    [`${filePanel}:has(${showCssInput}:not(:checked)) &`]: { display: 'none' },
  },
});
