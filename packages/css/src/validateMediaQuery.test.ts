import { validateMediaQuery } from './validateMediaQuery';

describe('validateMediaQuery', () => {
  describe('valid selectors', () => {
    const validMediaQueries = [
      'screen',
      'screen, print',
      'screen and (max-width: 600px)',
      '(min-width: 5rem)',
      '(min-width: 30em) and (orientation: landscape)',
      'only screen and (min-width: 320px) and (max-width: 480px) and (resolution: 150dpi)',
      'not screen and (color), print and (color)',
      '(prefers-reduced-motion)',
      '(prefers-reduced-motion: no-preference)',
    ];

    validMediaQueries.forEach((query) =>
      it(query, () => {
        expect(() => validateMediaQuery(query)).not.toThrow();
      }),
    );
  });

  describe('invalid media queries', () => {
    it('empty query', () => {
      expect(() => validateMediaQuery('')).toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"\\"

        Query is empty

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('random query', () => {
      expect(() => validateMediaQuery('random query'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"random query\\"

        Unknown ident 'random' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('(min-height: 600px', () => {
      expect(() => validateMediaQuery('(min-height: 600px'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"(min-height: 600px\\"

        Invalid media condition
        Expected media condition after '('

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('min-width: 600px)', () => {
      expect(() => validateMediaQuery('min-width: 600px)'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"min-width: 600px)\\"

        Unknown ident 'min-width' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });

    it('prefers-reduced-motion: no-preference', () => {
      expect(() => validateMediaQuery('prefers-reduced-motion: no-preference'))
        .toThrowErrorMatchingInlineSnapshot(`
        "Invalid media query: \\"prefers-reduced-motion: no-preference\\"

        Unknown ident 'prefers-reduced-motion' in media query

        Read more on MDN: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries"
      `);
    });
  });
});
