import { expect, describe, it } from 'vitest';

import { validateMediaQuery } from './validateMediaQuery';

describe('validateMediaQuery', () => {
  describe('valid selectors', () => {
    const validMediaQueries = [
      '@media screen',
      '@media screen, print',
      '@media screen and (max-width: 600px)',
      '@media (min-width: 5rem)',
      '@media (min-width: 30em) and (orientation: landscape)',
      '@media only screen and (min-width: 320px) and (max-width: 480px) and (resolution: 150dpi)',
      '@media not screen and (color), print and (color)',
      '@media (prefers-reduced-motion)',
      '@media (prefers-reduced-motion: no-preference)',
    ];

    validMediaQueries.forEach((query) =>
      it(query, () => {
        expect(() => validateMediaQuery(query)).not.toThrow();
      }),
    );
  });

  describe('invalid media queries', () => {
    it('empty query', () => {
      expect(() => validateMediaQuery('@media '))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media \\"

        Query is empty

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('random query', () => {
      expect(() => validateMediaQuery('@media random query'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media random query\\"

        Unknown ident 'random' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('(min-height: 600px', () => {
      expect(() => validateMediaQuery('@media (min-height: 600px'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media (min-height: 600px\\"

        Invalid media condition
        Expected media condition after '('

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('min-width: 600px)', () => {
      expect(() => validateMediaQuery('@media min-width: 600px)'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media min-width: 600px)\\"

        Unknown ident 'min-width' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('prefers-reduced-motion: no-preference', () => {
      expect(() =>
        validateMediaQuery('@media prefers-reduced-motion: no-preference'),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media prefers-reduced-motion: no-preference\\"

        Unknown ident 'prefers-reduced-motion' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('Double media: @media @media screen and (min-width: 640px)', () => {
      expect(() =>
        validateMediaQuery('@media @media screen and (min-width: 640px)'),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"@media @media screen and (min-width: 640px)\\"

        Expected media condition or media prefix

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });
  });
});
