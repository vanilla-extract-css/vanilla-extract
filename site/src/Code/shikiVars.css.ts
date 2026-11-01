import { createGlobalThemeContract } from '@vanilla-extract/css';

// The variables used by Shiki's CSS variables theme, see `markdown/highlight.ts`
export const shikiVars = createGlobalThemeContract(
  {
    foreground: null,
    token: {
      constant: null,
      parameter: null,
      keyword: null,
      link: null,
      string: null,
      'string-expression': null,
      comment: null,
      punctuation: null,
      function: null,
    },
  },
  (_value, path) => `shiki-${path.join('-')}`,
);
