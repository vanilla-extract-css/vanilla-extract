import { globalStyle } from '@vanilla-extract/css';
import { darkMode } from '../system/styles/sprinkles.css';
import { vars } from '../themes.css';

globalStyle('.DocSearch', {
  fontFamily: vars.fonts.body,
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
