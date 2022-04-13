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
    ];

    validMediaQueries.forEach((query) =>
      it(query, () => {
        expect(() => validateMediaQuery(query)).not.toThrow();
      }),
    );
  });

  describe('invalid media queries', () => {
    const invalidMediaQueries = [
      '',
      'random query',
      '(min-height: 600px',
      'min-width: 600px)',
    ];

    invalidMediaQueries.forEach((query) =>
      it(query, () => {
        expect(() => validateMediaQuery(query)).toThrow();
      }),
    );
  });
});
