import { style, createTheme, createGlobalTheme } from '@mattsjones/css-core';

export const themeVars = createGlobalTheme(':root', {
  space: `10px`,
});

export const twentyTheme = createTheme(themeVars, {
  space: `20px`,
});

export const hide = style({ display: 'none' });

export const blackBg = style({ backgroundColor: '#000' });

export const padding = style({ paddingTop: themeVars.space });
