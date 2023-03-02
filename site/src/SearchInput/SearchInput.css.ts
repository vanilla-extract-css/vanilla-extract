import { createVar, globalStyle } from '@vanilla-extract/css';
import { homePage } from '../HomePage/HomePage.css';
import { darkMode as darkModeClass } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';
import { responsiveStyle } from '../themeUtils';

const searchInputMinSize = 44;
const darkMode = `html.${darkModeClass}`;
const lightMode = `html:not(.${darkModeClass})`;
const focusRingColor = createVar();
const formBackgroundColor = createVar();
const iconSize = createVar();
const hitSourceColor = createVar();
const hitIndicatorColor = createVar();
const hitIndicatorAngle = createVar();

globalStyle('.DocSearch', {
  fontFamily: vars.fonts.body,
  minHeight: searchInputMinSize,
  minWidth: searchInputMinSize,
  ...responsiveStyle({
    mobile: {
      vars: {
        '--docsearch-spacing': vars.spacing.large,
      },
    },
    tablet: {
      vars: {
        '--docsearch-spacing': vars.spacing.xlarge,
      },
    },
  }),
});

/**
 * DocSearch Vars
 */
globalStyle(`${lightMode} .DocSearch`, {
  vars: {
    '--docsearch-text-color': vars.palette.coolGray900,
    '--docsearch-searchbox-focus-background': vars.palette.blue50,
    '--docsearch-searchbox-background': vars.palette.blue50,
    '--docsearch-searchbox-shadow': `none`,
    '--docsearch-key-gradient': vars.palette.teal100,
    '--docsearch-key-shadow': 'none',
    '--docsearch-muted-color': vars.palette.coolGray700,
    '--docsearch-container-background': vars.palette.teal100,
    '--docsearch-modal-background': vars.palette.white,
    '--docsearch-modal-shadow': `none`,
    '--docsearch-footer-background': 'none',
    '--docsearch-footer-shadow': `none`,
    '--docsearch-highlight-color': vars.palette.pink500,
    '--docsearch-hit-shadow': 'none',
    '--docsearch-logo-color': vars.palette.black,
    '--docsearch-hit-active-color': vars.palette.black,
    '--docsearch-hit-color': vars.palette.coolGray500,
    [hitSourceColor]: vars.palette.green500,
    [focusRingColor]: vars.palette.pink400,
    [formBackgroundColor]: vars.palette.blue50,
    [hitIndicatorColor]: vars.palette.blue300,
  },
});

globalStyle(`${lightMode} ${homePage} .DocSearch`, {
  vars: {
    '--docsearch-searchbox-focus-background': vars.palette.teal200muted,
    '--docsearch-searchbox-background': vars.palette.teal200muted,
  },
});

globalStyle(`${darkMode} .DocSearch`, {
  vars: {
    '--docsearch-text-color': vars.palette.gray50,
    '--docsearch-searchbox-focus-background': vars.palette.gray800,
    '--docsearch-searchbox-background': vars.palette.gray800,
    '--docsearch-searchbox-shadow': `none`,
    '--docsearch-key-gradient': vars.palette.gray900,
    '--docsearch-key-shadow': 'none',
    '--docsearch-muted-color': vars.palette.gray400,
    '--docsearch-container-background': vars.palette.black,
    '--docsearch-modal-background': vars.palette.gray900,
    '--docsearch-modal-shadow': `none`,
    '--docsearch-footer-background': 'none',
    '--docsearch-footer-shadow': `none`,
    '--docsearch-highlight-color': vars.palette.pink400,
    '--docsearch-hit-background': 'none',
    '--docsearch-hit-shadow': 'none',
    '--docsearch-logo-color': vars.palette.white,
    '--docsearch-hit-active-color': vars.palette.white,
    '--docsearch-hit-color': vars.palette.gray400,
    [hitSourceColor]: vars.palette.green300,
    [focusRingColor]: vars.palette.pink500,
    [formBackgroundColor]: vars.palette.gray800,
    [hitIndicatorColor]: vars.palette.blue400,
  },
});

/**
 * DocSearch Button
 */
globalStyle(
  `.DocSearch-Button`,
  responsiveStyle({
    mobile: {
      margin: 0,
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      background: 'none',
    },
    tablet: {
      paddingLeft: vars.spacing.large,
      paddingRight: vars.spacing.medium,
      borderRadius: vars.border.radius.small,
      background: 'var(--docsearch-searchbox-background)',
    },
  }),
);

globalStyle(
  '.DocSearch-Button:hover, .DocSearch-Button:focus',
  responsiveStyle({
    mobile: {
      background: 'none',
    },
    tablet: {
      background: 'var(--docsearch-searchbox-background)',
    },
  }),
);

globalStyle('.DocSearch-Button:focus-visible', {
  boxShadow: `0px 0px 0px 3px ${focusRingColor}`,
});

globalStyle('.DocSearch-Button .DocSearch-Button-Keys', {
  justifyContent: 'flex-end',
});

globalStyle('.DocSearch-Button .DocSearch-Button-Key', {
  vars: {
    '--docsearch-key-gradient': 'none',
  },
  padding: 0,
  margin: 0,
  width: 'auto',
  fontFamily: vars.fonts.body,
});

globalStyle(`.DocSearch-Button-Placeholder`, {
  paddingLeft: vars.spacing.medium,
  paddingRight: vars.spacing.medium,
});

/**
 * DocSearch Search Icon
 */
globalStyle('.DocSearch-Search-Icon', {
  strokeWidth: 2,
  color: 'var(--docsearch-text-color)',
  height: iconSize,
  width: iconSize,
  ...responsiveStyle({
    mobile: {
      vars: {
        [iconSize]: '24px',
      },
    },
    tablet: {
      vars: {
        [iconSize]: '18px',
      },
    },
  }),
});

/**
 * DocSearch Container (holds the modal)
 */
globalStyle(`.DocSearch-Container`, {
  background: 'none',
});

globalStyle(`.DocSearch-Container::before`, {
  content: '',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  pointerEvents: 'none',
  background: 'var(--docsearch-container-background)',
  backdropFilter: 'blur(4px)',
  opacity: 0.9,
});

/**
 * DocSearch Modal
 */
globalStyle(`.DocSearch-Modal`, {
  background: 'none',
});

globalStyle(`.DocSearch-Modal::before`, {
  content: '',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  pointerEvents: 'none',
  background: 'var(--docsearch-modal-background)',
  ...responsiveStyle({
    tablet: {
      clipPath: 'polygon(1% 1%, 98% 0, 100% 100%, 0 98%)',
      bottom: 'var(--docsearch-footer-height)',
    },
  }),
});

/**
 * DocSearch Form (input field container)
 */
globalStyle('.DocSearch-Form', {
  vars: {
    '--docsearch-searchbox-focus-background': formBackgroundColor,
  },
  ...responsiveStyle({
    mobile: {
      paddingLeft: vars.spacing.medium,
      paddingRight: vars.spacing.medium,
    },
    tablet: {
      paddingLeft: vars.spacing.large,
      paddingRight: vars.spacing.large,
    },
  }),
});

/**
 * DocSearch Input
 */
globalStyle(`.DocSearch-Input`, {
  paddingLeft: vars.spacing.large,
});

/**
 * DocSearch Cancel (close button on mobile)
 */
globalStyle(`.DocSearch-Cancel`, {
  color: 'var(--docsearch-text-color)',
});

/**
 * DocSearch Hit Source (section heading)
 */
globalStyle(`.DocSearch-Hit-source`, {
  color: hitSourceColor,
});

/**
 * DocSearch Hit Item
 */
globalStyle(`.DocSearch-Hit > a`, {
  padding: `${vars.spacing.medium} ${vars.spacing.medium}`,
});

globalStyle(`.DocSearch-Hit[aria-selected=true] > a`, {
  background: 'none',
});

/**
 * DocSearch Hit Item Indicator
 */
globalStyle(`.DocSearch-Hit a::before`, {
  backgroundColor: hitIndicatorColor,
  content: '""',
  width: vars.spacing.xsmall,
  position: 'absolute',
  left: '-8px',
  top: '24px',
  bottom: '24px',
  borderRadius: vars.border.radius.small,
  transform: `skew(${hitIndicatorAngle})`,
  transition: 'transform .15s ease',
});

globalStyle(`.DocSearch-Hit[aria-selected=false] a::before`, {
  opacity: 0,
});

globalStyle(
  [
    `.DocSearch-Hit[aria-selected=true] a::before`,
    `.DocSearch-Hit:nth-child(2n) a::before`,
  ].join(', '),
  {
    vars: {
      [hitIndicatorAngle]: '-8deg',
    },
  },
);

globalStyle(
  [
    `.DocSearch-Hit a::before`,
    `.DocSearch-Hit[aria-selected=true]:nth-child(2n) a::before`,
  ].join(', '),
  {
    vars: {
      [hitIndicatorAngle]: '8deg',
    },
  },
);

/**
 * DocSearch Hit Mark (Match highlight color)
 */
globalStyle(`.DocSearch-Hit[aria-selected=true] mark`, {
  vars: {
    '--docsearch-hit-active-color': 'var(--docsearch-highlight-color)',
  },
});

/**
 * DocSearch Hit Mark (Match highlight color)
 */
globalStyle(`.DocSearch-Logo svg *`, {
  fill: 'var(--docsearch-muted-color)',
});
