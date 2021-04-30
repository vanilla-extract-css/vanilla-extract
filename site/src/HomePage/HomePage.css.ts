import { createVar, style } from '@vanilla-extract/css';
import { darkMode, lightMode } from '../system/styles/atoms.css';
import { vars } from '../themes.css';
import { responsiveStyle } from '../themeUtils';

export const shadowColorVar = createVar();

export const installBlock = style({
  fontFamily: vars.fonts.code,
  boxShadow: `0 0 50px -10px ${shadowColorVar}`,
  selectors: {
    [`.${lightMode} &`]: {
      vars: {
        [shadowColorVar]: vars.palette.green200,
      },
    },
    [`.${darkMode} &`]: {
      vars: {
        [shadowColorVar]: vars.palette.gray600,
      },
    },
  },
});

export const featureKeyLine = style({
  transform: 'skew(15deg)',
  ...responsiveStyle({
    mobile: { height: vars.text.standard.mobile.lineHeight },
    desktop: { height: vars.text.standard.desktop.lineHeight },
  }),
});

export const skewedContainer = style({
  ':after': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    width: '100vw',
    height: '170px',
    background: 'inherit',
    clipPath: 'polygon(0 0,100% 0,100% 60%,0 100%)',
  },
});

export const skewedContainerSecondary = style({
  ':before': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    width: '100vw',
    height: '100px',
    top: '-60px',
    background: 'inherit',
    clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)',
  },
  ':after': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    width: '100vw',
    height: '100px',
    bottom: '-70px',
    background: 'inherit',
    clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)',
  },
});
