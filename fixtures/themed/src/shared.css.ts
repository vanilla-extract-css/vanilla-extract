import { globalStyle, style } from '@vanilla-extract/css';

export const shadow = style({
  boxShadow: '0 0 5px red',
});

globalStyle('body', {
  backgroundColor: 'skyblue',
});
