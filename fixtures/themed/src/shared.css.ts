import { globalStyle, style } from '@vanilla-extract/css';

export const shadow: string = style({
  boxShadow: '0 0 5px red',
});

globalStyle('body', {
  backgroundColor: 'skyblue',
  lineHeight: '16px',
});
