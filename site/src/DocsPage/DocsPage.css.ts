import { style } from '@vanilla-extract/css';
import { vars } from '../themes.css';
import { responsiveStyle } from '../themeUtils';

const headerHeight = '100px';
const sidebarWidth = '300px';

export const homeLink = style({
  textDecoration: 'none',
  ':focus': {
    outline: 'none',
    filter: `drop-shadow(2px 4px 2px ${vars.palette.pink600})`,
  },
});

export const header = style({
  height: headerHeight,
  clipPath: 'polygon(0 0, 100% 0, 100% 20%, 0 100%)',
  backdropFilter: 'blur(4px)',
  opacity: 0.8,
});

export const container = style({
  minHeight: `calc(100% - ${headerHeight})`,
  ...responsiveStyle({
    desktop: {
      paddingTop: headerHeight,
    },
  }),
});

export const sidebarOpen = style({});

export const sidebar = style({
  right: 0,
  width: '40vw',
  minWidth: sidebarWidth,
  transition: 'transform .15s ease, opacity .15s ease',
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
    desktop: {
      background: 'none',
      top: headerHeight,
      right: 'initial',
      width: sidebarWidth,
    },
  }),

  selectors: {
    [`:not(${sidebarOpen})&`]: {
      '@media': {
        'screen and (max-width: 1199px)': {
          transform: 'translateX(12px)',
        },
      },
    },
  },
});

export const main = style(
  responsiveStyle({
    desktop: {
      marginLeft: sidebarWidth,
    },
  }),
);

export const backdrop = style({
  transition: 'opacity 0.1s ease',
  backdropFilter: 'blur(4px)',
});

export const backdrop_isVisible = style({
  opacity: 0.8,
});
