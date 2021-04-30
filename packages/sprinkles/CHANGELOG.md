# @vanilla-extract/sprinkles

## 0.1.1

### Patch Changes

- [#63](https://github.com/seek-oss/vanilla-extract/pull/63) [`2cecc8a`](https://github.com/seek-oss/vanilla-extract/commit/2cecc8af8634b71f217d713c5a9faf989b46e353) Thanks [@fnky](https://github.com/fnky)! - Allow theme vars to be passed to atomic properties

* [#64](https://github.com/seek-oss/vanilla-extract/pull/64) [`5bee64f`](https://github.com/seek-oss/vanilla-extract/commit/5bee64f50753665b4c02bcc9fd8db115c42b35c9) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Support resolving falsey values for conditional atoms

  Fixes bug where falsey values such as `opacity: 0` would not resolve classes via the conditional object or responsive array syntax.

  ```ts
  export const atoms = createAtomicStyles({
    defaultCondition: 'mobile',
    conditions: {
      mobile: {},
      desktop: {
        '@media': 'screen and (min-width: 786px)',
      },
    },
    responsiveArray: ['mobile', 'desktop'],
    properties: {
      opacity: [0, 1],
    },
  });
  ```

- [#59](https://github.com/seek-oss/vanilla-extract/pull/59) [`e999308`](https://github.com/seek-oss/vanilla-extract/commit/e99930846ed2305544716942a5703a0b67c2df83) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix types for numbers as values

- Updated dependencies [[`2cecc8a`](https://github.com/seek-oss/vanilla-extract/commit/2cecc8af8634b71f217d713c5a9faf989b46e353)]:
  - @vanilla-extract/css@0.4.1

## 0.1.0

### Patch Changes

- Updated dependencies [[`48c4a78`](https://github.com/seek-oss/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656), [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d)]:
  - @vanilla-extract/css@0.4.0
