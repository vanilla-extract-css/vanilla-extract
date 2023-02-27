import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { headerHeight } from './DocsPage/DocsPage.css';
import { vars } from './themes.css';

export const headingScrollTop = style({
  scrollMarginTop: calc.add(headerHeight, vars.spacing.xxlarge),
});
