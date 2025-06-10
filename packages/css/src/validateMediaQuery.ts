import dedent from 'dedent';
import { toAST } from 'media-query-parser';

const createMediaQueryError = (mediaQuery: string, msg: string) =>
  new Error(
    dedent`
    Invalid media query: "${mediaQuery}"

    ${msg}

    Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
  `,
  );

export const validateMediaQuery = (mediaQuery: string): void => {
  // Empty queries will start with '@media '
  if (mediaQuery === '@media ') {
    throw createMediaQueryError(mediaQuery, 'Query is empty');
  }

  try {
    toAST(mediaQuery);
  } catch (e: any) {
    throw createMediaQueryError(mediaQuery, e.message);
  }
};
