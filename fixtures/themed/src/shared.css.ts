import { globalStyle, style } from '@mattsjones/css-core';

export const shadow = style({
  boxShadow: '0 0 5px red',
});

globalStyle('body', {
  backgroundColor: 'skyblue',
});
