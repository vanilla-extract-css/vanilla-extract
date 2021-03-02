import merge from 'lodash/merge';
import mapKeys from 'lodash/mapKeys';
import each from 'lodash/each';
import pickBy from 'lodash/pickBy';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

export const simplePseudos = [
  ':-moz-any-link',
  ':-moz-full-screen',
  ':-moz-placeholder',
  ':-moz-read-only',
  ':-moz-read-write',
  ':-ms-fullscreen',
  ':-ms-input-placeholder',
  ':-webkit-any-link',
  ':-webkit-full-screen',
  '::-moz-placeholder',
  '::-moz-progress-bar',
  '::-moz-range-progress',
  '::-moz-range-thumb',
  '::-moz-range-track',
  '::-moz-selection',
  '::-ms-backdrop',
  '::-ms-browse',
  '::-ms-check',
  '::-ms-clear',
  '::-ms-fill',
  '::-ms-fill-lower',
  '::-ms-fill-upper',
  '::-ms-reveal',
  '::-ms-thumb',
  '::-ms-ticks-after',
  '::-ms-ticks-before',
  '::-ms-tooltip',
  '::-ms-track',
  '::-ms-value',
  '::-webkit-backdrop',
  '::-webkit-input-placeholder',
  '::-webkit-progress-bar',
  '::-webkit-progress-inner-value',
  '::-webkit-progress-value',
  '::-webkit-slider-runnable-track',
  '::-webkit-slider-thumb',
  '::after',
  '::backdrop',
  '::before',
  '::cue',
  '::first-letter',
  '::first-line',
  '::grammar-error',
  '::placeholder',
  '::selection',
  '::spelling-error',
  ':active',
  ':after',
  ':any-link',
  ':before',
  ':blank',
  ':checked',
  ':default',
  ':defined',
  ':disabled',
  ':empty',
  ':enabled',
  ':first',
  ':first-child',
  ':first-letter',
  ':first-line',
  ':first-of-type',
  ':focus',
  ':focus-visible',
  ':focus-within',
  ':fullscreen',
  ':hover',
  ':in-range',
  ':indeterminate',
  ':invalid',
  ':last-child',
  ':last-of-type',
  ':left',
  ':link',
  ':only-child',
  ':only-of-type',
  ':optional',
  ':out-of-range',
  ':placeholder-shown',
  ':read-only',
  ':read-write',
  ':required',
  ':right',
  ':root',
  ':scope',
  ':target',
  ':valid',
  ':visited',
] as const;

export type SimplePseudos = typeof simplePseudos;

const simplePseudoSet = new Set<string>(simplePseudos);

const normalizeStyles = (className: string, styles: any) => {
  const omitThese = [...simplePseudos, '@media', '@supports', 'selectors'];

  const pseudoStyles = mapKeys(
    pickBy(styles, (_, key) => simplePseudoSet.has(key)),
    (_, pseudo) => `${className}${pseudo}`,
  );

  let selectorStyles = {};
  if (styles.selectors) {
    selectorStyles = mapKeys(styles.selectors, (_, selector) => {
      return selector.replace(RegExp('&', 'g'), className);
    });
  }

  const rawRules = omit(styles, omitThese);

  const rawStyles =
    Object.keys(rawRules).length > 0
      ? {
          [className]: rawRules,
        }
      : {};

  const allStyles = Object.assign(rawStyles, pseudoStyles, selectorStyles);

  Object.keys(allStyles).forEach((ident) => {
    if (allStyles[ident]['@keyframes']) {
      const { '@keyframes': keyframeRef, animation } = allStyles[ident];

      if (keyframeRef) {
        Object.assign(allStyles[ident], {
          animation: animation
            ? animation.replace('@keyframes', keyframeRef)
            : undefined,
          animationName: animation ? undefined : keyframeRef,
          '@keyframes': undefined,
        });
      }
    }
  });

  return allStyles;
};

export default (selector: string, cssObj: any) => {
  const stylesheet = {};
  const responsiveStylesheet = {};

  const defaultStyles = normalizeStyles(selector, cssObj);
  const responsiveStyles = {};

  if (cssObj['@media']) {
    each(cssObj['@media'], (mediaStyles, query) => {
      const blockStyles = normalizeStyles(selector, mediaStyles);

      if (!isEqual(defaultStyles, blockStyles)) {
        merge(responsiveStyles, {
          [`@media ${query}`]: blockStyles,
        });
      }
    });
  }

  if (cssObj['@supports']) {
    each(cssObj['@supports'], (mediaStyles, query) => {
      const blockStyles = normalizeStyles(selector, mediaStyles);

      if (!isEqual(defaultStyles, blockStyles)) {
        merge(responsiveStyles, {
          [`@supports ${query}`]: blockStyles,
        });
      }
    });
  }

  merge(stylesheet, defaultStyles);
  merge(responsiveStylesheet, responsiveStyles);

  return Object.assign(stylesheet, responsiveStylesheet);
};
