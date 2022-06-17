import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { vars } from '../themes.css';
import { responsiveStyle } from '../themeUtils';

const headerHeight = '90px';
const sidebarWidth = '300px';

export const bodyLock = style({
  overflow: 'hidden!important',
});

export const homeLink = style({
  textDecoration: 'none',
  ':focus-visible': {
    outline: 'none',
    filter: `drop-shadow(2px 4px 1px ${vars.palette.pink400})`,
  },
});

export const header = style(
  responsiveStyle({
    mobile: {
      height: '136px',
    },
    desktop: {
      height: headerHeight,
    },
  }),
);

export const headerBg = style({
  ...responsiveStyle({
    mobile: {
      width: '100%',
      clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 100%)',
    },
    desktop: {
      width: sidebarWidth,
      height: '100vh',
      clipPath: 'initial',
    },
  }),
});

export const container = style(
  responsiveStyle({
    desktop: {
      paddingTop: `${calc(headerHeight).add(vars.spacing.medium)}`,
    },
  }),
);

export const sidebar = style({
  ...responsiveStyle({
    mobile: {
      width: `clamp(300px, 40vw, 400px)`,
      transition: 'transform .15s ease, opacity .15s ease',
      top: 0,
      bottom: 0,
      overflow: 'auto',
    },
    desktop: {
      width: sidebarWidth,
      top: `${calc(headerHeight).add(vars.spacing.large)}`,
    },
  }),
});

export const showOnWideScreens = style({
  '@media': {
    [`screen and (max-width: 1500px)`]: {
      display: 'none'
    }
  }
});

export const active = style({});

export const activeIndicator = style({
  transition: 'transform .3s ease, opacity .3s ease',
  transform: 'skew(15deg)',
  selectors: {
    [`&:not(${active})`]: {
      transform: 'translateX(-80%)',
    },
  },
});

export const activeIndicatorRight = style({
  transform: 'skew(-15deg)',
});

export const primaryNavOpen = style({});

export const primaryNav = style({
  ':before': {
    content: '""',
    position: 'absolute',
    zIndex: -1,
    left: '-30px',
    top: 0,
    bottom: 0,
    width: '50px',
    background: 'inherit',
    clipPath: 'polygon(100% 0, 100% 100%, 0 100%, 60% 0)',
  },
  ...responsiveStyle({
    mobile: {
      width: `clamp(300px, 40vw, 400px)`,
      transition: 'transform .15s ease, opacity .15s ease',
      top: 0,
      bottom: 0,
      right: 0,
    },
    desktop: {
      right: 'initial',
      background: 'initial!important',
    },
  }),
  selectors: {
    [`:not(${primaryNavOpen})&`]: {
      '@media': {
        'screen and (max-width: 1199px)': {
          transform: 'translateX(12px)',
        },
      },
    },
  },
});

export const scrollContainer = style({
  overflow: 'auto',
  height: '100%',
});

export const main = style([
  responsiveStyle({
    desktop: {
      marginLeft: sidebarWidth,
    },
  }),
  {
    '@media': {
      [`screen and (min-width: 1500px)`]: {
        marginRight: sidebarWidth,
      }
    }
  }
]);

export const backdrop = style({
  transition: 'opacity 0.1s ease',
  backdropFilter: 'blur(4px)',
});

export const backdrop_isVisible = style({
  opacity: 0.8,
});
