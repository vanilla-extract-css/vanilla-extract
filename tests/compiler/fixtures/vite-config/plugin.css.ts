import { style } from '@vanilla-extract/css';
// @ts-expect-error virtual module
import { color } from '~/vars';

export const root = style({
  color,
});
