import { mapValues } from 'lodash';
import { createAtomicStyles } from '@vanilla-extract/sprinkles';
import { calc } from '@vanilla-extract/css-utils';
import { breakpoints } from '../../themeUtils';
import { vars } from '../../themes.css';

const space = vars.spacing;

const negativeSpace = {
  ['-xsmall']: `${calc(space.xsmall).negate()}`,
  ['-small']: `${calc(space.small).negate()}`,
  ['-medium']: `${calc(space.medium).negate()}`,
  ['-large']: `${calc(space.large).negate()}`,
  ['-xlarge']: `${calc(space.xlarge).negate()}`,
  ['-xxlarge']: `${calc(space.xxlarge).negate()}`,
  ['-xxxlarge']: `${calc(space.xxxlarge).negate()}`,
};

const margins = {
  ...space,
  ...negativeSpace,
};

export const responsiveStyles = createAtomicStyles({
  conditions: mapValues(breakpoints, (bp) =>
    bp === 0 ? {} : { '@media': `screen and (min-width: ${bp}px)` },
  ),
  defaultCondition: 'mobile',
  properties: {
    position: ['absolute', 'relative', 'fixed'],
    display: ['none', 'block', 'inline', 'inline-block', 'flex'],
    alignItems: ['flex-start', 'center', 'flex-end'],
    justifyContent: ['flex-start', 'center', 'flex-end', 'space-between'],
    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    marginTop: margins,
    marginBottom: margins,
    marginLeft: margins,
    marginRight: margins,
    pointerEvents: ['none'],
    opacity: [0, 1],
  },
  shorthands: {
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
  },
});

export const lightMode = 'light';
export const darkMode = 'dark';

export const colorStyles = createAtomicStyles({
  conditions: {
    lightMode: { selector: `.${lightMode} &` },
    darkMode: { selector: `.${darkMode} &` },
  },
  defaultCondition: false,
  properties: {
    background: vars.palette,
    color: vars.palette,
  },
});

export const unresponsiveStyles = createAtomicStyles({
  properties: {
    flexWrap: ['wrap', 'nowrap'],
    top: [0],
    bottom: [0],
    left: [0],
    right: [0],
    flexShrink: [0],
    flexGrow: [0, 1],
    zIndex: [-1, 0, 1],
    width: { full: '100%' },
    borderRadius: vars.border.radius,
  },
});
