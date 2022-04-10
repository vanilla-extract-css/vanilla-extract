import outdent from 'outdent';
import { parse } from 'css-mediaquery';

const mediaTypes = ['all', 'print', 'screen'];

export const validateMediaQuery = (mediaQuery: string) => {
  const { type, expressions } = parse(mediaQuery)?.[0];

  const isAllQuery = mediaQuery === 'all';
  const isValidType = mediaTypes.includes(type);

  // If the parser returns all for the type, we should have expressions
  // or the query should match 'all' otherwise it is invalid
  if (!isValidType || (!isAllQuery && type === 'all' && !expressions.length)) {
    throw new Error(
      outdent`
      Invalid media query: ${mediaQuery}

      A media query can contain an optional media type and any number of media feature expressions.
  
      Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
    `,
    );
  }
};
