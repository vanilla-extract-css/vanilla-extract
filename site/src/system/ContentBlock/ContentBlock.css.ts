import { mapToProperty } from './../../themeUtils';
import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../themes.css';

export const root = style({
  margin: '0 auto',
});

export const width = styleVariants(
  vars.contentWidth,
  mapToProperty('maxWidth'),
);
