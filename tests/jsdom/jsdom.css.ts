import { style, createTheme, createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  space: `10px`,
});

export const twentyTheme = createTheme(vars, {
  space: `20px`,
});

export const hide = style({ display: 'none' });

export const blackBg = style({ backgroundColor: '#000' });

export const padding = style({ paddingTop: vars.space });
