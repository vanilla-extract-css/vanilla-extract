import { style, StyleRule } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { vars } from "../themes.css";

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
    opacity: 1,
  }),
  {
    selectors: {
      [`${showCssOnMobile} &`]: belowSideBySideStyles({
        transform: `scale(.9)`,
        opacity: 0.5,
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
  }),
  {
    selectors: {
      [`${showCssOnMobile} &`]: belowSideBySideStyles({
        transform: 'translateX(-100%)',
        opacity: 1,
      })
    }
  }
]);

export const buttonContainer = style(sideBySideStyles({
  display: 'none'
}));
