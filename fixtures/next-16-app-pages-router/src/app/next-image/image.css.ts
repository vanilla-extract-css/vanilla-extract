import logo from './logo.png';
import { style } from '@vanilla-extract/css';

export const imageStyle = style({
  backgroundImage: `url(${logo.src})`,
  width: `${logo.width}px`,
  height: `${logo.height}px`,
  border: '1px solid red',
});
