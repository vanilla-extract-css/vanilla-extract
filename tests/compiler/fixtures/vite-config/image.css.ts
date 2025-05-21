import { style } from '@vanilla-extract/css';
// @ts-expect-error No type definition for image assets
import testImage from './test.jpg';

export const imageStyle1 = style({
  backgroundImage: `url('${testImage}')`,
});

export const imageStyle2 = style({
  backgroundImage: `url('/fixtures/vite-config/test.jpg')`,
});
