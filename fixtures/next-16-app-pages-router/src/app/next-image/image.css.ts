import logo from './logo.png';
import { style } from '@vanilla-extract/css';
import type { StaticImageData } from 'next/image';

// types are funky because of our monorepo setup
const withCast = logo as unknown as StaticImageData;

export const imageStyle = style({
  backgroundImage: `url(${withCast.src})`,
  width: `${withCast.width}px`,
  height: `${withCast.height}px`,
  border: '1px solid red',
});
