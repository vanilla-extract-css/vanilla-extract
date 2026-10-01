/**
 * The default file extensions that vanilla-extract processes.
 * This is the single source of truth — cssFileFilter is derived from this.
 */
export const DEFAULT_FILE_EXTENSIONS = [
  '.css.ts',
  '.css.tsx',
  '.css.js',
  '.css.jsx',
  '.css.mjs',
  '.css.cjs',
] as const;

// Derive regex pattern from the array to prevent drift
const extensionPattern = DEFAULT_FILE_EXTENSIONS.map((ext) =>
  ext.replace(/\./g, '\\.'),
).join('|');

// Vite adds a "?used" to CSS files it detects, this isn't relevant for
// .css.ts files but it's added anyway so we need to allow for it in the file match
export const cssFileFilter: RegExp = new RegExp(
  `(${extensionPattern})(\\?used)?$`,
);
export const virtualCssFileFilter: RegExp = /\.vanilla\.css\?source=.*$/;
