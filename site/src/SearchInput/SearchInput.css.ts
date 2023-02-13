import { globalStyle } from '@vanilla-extract/css';
import { vars } from '../themes.css';

globalStyle('.DocSearch', {
  vars: {
    '--docsearch-primary-color': vars.palette.pink500,
    '--docsearch-highlight-color': vars.palette.pink500,
    '--docsearch-text-color': vars.palette.white,
    '--docsearch-searchbox-focus-background': vars.palette.gray800,
    '--docsearch-searchbox-background': vars.palette.gray800,
    '--docsearch-modal-background': vars.palette.gray800,
    '--docsearch-modal-shadow': `inset 1px 1px 0 0 hsla(0, 0%, 0%, 0.5), 0 3px 8px 0 ${vars.palette.blueGray800}`,
    '--docsearch-footer-background': vars.palette.gray800,
    '--docsearch-muted-color': vars.palette.gray400,
    '--docsearch-hit-color': vars.palette.white,
    '--docsearch-hit-background': vars.palette.gray900,
    '--docsearch-key-gradient': `linear-gradient(-225deg, ${vars.palette.gray500}, ${vars.palette.gray900})`,
    '--docsearch-key-shadow': `inset 0 -2px 0 0 ${vars.palette.gray700}, inset 0 0 1px 1px ${vars.palette.black}, 0 1px 2px 1px ${vars.palette.gray700}`,
    '--foo-bar': '#f00',
  },
  fontFamily: vars.fonts.body,
});
