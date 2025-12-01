import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  backgroundColor: '#0cdbcd',
});

export const c = style({
  border: '1px solid black',
});
