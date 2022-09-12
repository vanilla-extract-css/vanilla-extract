// Vite adds a "?used" to CSS files it detects, this isn't relevant for
// .css.ts files but it's added anyway so we need to allow for it in the file match
export const cssFileFilter = /\.css\.(js|mjs|cjs|jsx|ts|tsx)(\?used)?$/;
export const virtualCssFileFilter = /\.vanilla\.css\?source=.*$/;
