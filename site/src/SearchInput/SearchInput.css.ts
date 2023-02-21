import { createVar, fallbackVar, globalStyle } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

const searchInputMinSize = 44;

globalStyle('.DocSearch', {
  fontFamily: vars.fonts.body,
  minHeight: searchInputMinSize,
  minWidth: searchInputMinSize,
});

globalStyle(`.${darkMode} .DocSearch`, {
  vars: {
    '--docsearch-text-color': vars.palette.white,
    '--docsearch-searchbox-focus-background': vars.palette.gray800,
    '--docsearch-searchbox-background': vars.palette.gray800,
    '--docsearch-modal-background': vars.palette.gray800,
    '--docsearch-modal-shadow': `inset 1px 1px 0 0 hsla(0, 0%, 0%, 0.5), 0 3px 8px 0 ${vars.palette.gray800}`,
    '--docsearch-footer-background': vars.palette.gray800,
    '--docsearch-footer-shadow': `0 -1px 0 0 ${vars.palette.gray800}, 0 -3px 6px 0 ${vars.palette.gray700}`,
    '--docsearch-muted-color': vars.palette.gray500,
    '--docsearch-hit-color': vars.palette.white,
    '--docsearch-hit-background': vars.palette.gray900,
    '--docsearch-hit-shadow': 'none',
  },
});

const docsearchButton = `.DocSearch.DocSearch-Button`;
const focusColorVar = createVar();

globalStyle(docsearchButton, {
  boxShadow: `0 4px 8px rgba(14, 14, 33, 0.2), 0px 0px 0px 3px ${fallbackVar(
    focusColorVar,
    'transparent',
  )}`,
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  justifyContent: 'space-around',
});

globalStyle(`${docsearchButton}:focus-visible`, {
  vars: {
    [focusColorVar]: vars.palette.pink300,
  },
});

globalStyle(`.${darkMode} ${docsearchButton}:focus-visible`, {
  vars: {
    [focusColorVar]: vars.palette.pink600,
  },
});

const pseudos = [':hover', ':active'];
const docsearchButtonAndPseudos = [
  docsearchButton,
  ...pseudos.map((pseudo) => `${docsearchButton}${pseudo}`),
];

globalStyle(docsearchButtonAndPseudos.join(','), {
  vars: {
    '--docsearch-searchbox-background': vars.palette.white,
    '--docsearch-searchbox-focus-background': vars.palette.white,
    '--docsearch-text-color': vars.palette.coolGray900,
  },
});

globalStyle(
  docsearchButtonAndPseudos
    .map((className) => `.${darkMode} ${className}`)
    .join(','),
  {
    vars: {
      '--docsearch-searchbox-background': vars.palette.gray300,
      '--docsearch-searchbox-focus-background': vars.palette.gray300,
      '--docsearch-text-color': vars.palette.gray800,
    },
  },
);

globalStyle('.DocSearch .DocSearch-Search-Icon', {
  strokeWidth: 3.0,
});
