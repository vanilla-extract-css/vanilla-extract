import { createVar, style, StyleRule } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { darkMode } from "../system/styles/sprinkles.css";
import { vars } from "../themes.css";

const backgroundColor = createVar();
export const fileNameFocus = style({
  vars: {
    [backgroundColor]: vars.palette.coolGray900
  },
  outline: 'none',
  ':focus-visible': {
    boxShadow: `0 0 0 6px ${backgroundColor}, 0px 0px 0px 8px ${vars.palette.blue300}`,
  },
  selectors: {
    [`${darkMode} &:focus-visible`]: {
      vars: {
        [backgroundColor]: vars.palette.gray900
      },
    }
  }
});

export const fileIndicatorInactive = style({
  transform: 'skew(-15deg)',
  filter: 'saturate(0)',
  opacity: 0.2,
});
export const fileIndicatorActive = style({
  transform: 'skew(15deg)',
});

export const boldLayoutShiftFix = style({
  "::after": {
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
      "::after": {
        display: 'none'
      }
    }
  }
});

const sideBySideBreakpoint = 1000;

const sideBySideStyles = (styles: StyleRule): StyleRule => ({
  "@media": {
    [`screen and (min-width: ${sideBySideBreakpoint}px)`]: styles
  }
});

const belowSideBySideStyles = (styles: StyleRule): StyleRule => ({
  "@media": {
    [`screen and (max-width: ${sideBySideBreakpoint - 1}px)`]: styles
  }
});

export const showCssOnMobile = style({});

export const sourceContainer = style([
  {
    transformOrigin: '0 50%',
  },
  sideBySideStyles({
    width: 'auto',
    flexShrink: 1,
  }),
  {
    selectors: {
      [`${showCssOnMobile} &`]: belowSideBySideStyles({
        transform: `scale(.9)`,
        opacity: 0,
      })
    }
  }
]);

export const outputContainer = style([
  sideBySideStyles({
    width: '45%',
    flexGrow: 0,
    marginTop: calc(vars.spacing.medium).negate().toString(),
    marginRight: calc(vars.spacing.large).negate().toString(),
    marginBottom: calc(vars.spacing.large).negate().toString(),
    marginLeft: vars.spacing.large
  }),
  belowSideBySideStyles({
    transform: 'translateX(-80%)',
    flexGrow: 1,
    opacity: 0,
    pointerEvents: 'none'
  }),
  {
    selectors: {
      [`${showCssOnMobile} &`]: belowSideBySideStyles({
        transform: 'translateX(-100%)',
        opacity: 1,
        pointerEvents: 'auto'
      })
    }
  }
]);

export const buttonContainer = style(sideBySideStyles({
  display: 'none'
}));

export const button = style({
  userSelect: 'none',
  outline: 'none',
  ':active': {
    transform: 'scale(.95) translateZ(0)',
    transformOrigin: '50% 50%',
  },
  ':focus-visible': {
    boxShadow: `0px 0px 0px 4px ${vars.palette.blue400}`,
  },
});
