import { globalStyle, style } from '@vanilla-extract/css';

export const shadow: string = style({
  boxShadow: '0 0 5px red',
});

globalStyle('body', {
  backgroundColor: 'skyblue',
});

// make the screenshot less flaky in CI
globalStyle('body, button', {
  lineHeight: '16px',
});
