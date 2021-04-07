import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  border: '5px solid black',
});

export const sharedStyle = style({
  display: 'flex',
});
