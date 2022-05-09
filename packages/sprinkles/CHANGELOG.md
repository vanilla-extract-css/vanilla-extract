# @vanilla-extract/sprinkles

## 1.4.1

### Patch Changes

- [#676](https://github.com/seek-oss/vanilla-extract/pull/676) [`98ab94a`](https://github.com/seek-oss/vanilla-extract/commit/98ab94a99fa7dbee395a7ae6ea4af24c7b1bd7ab) Thanks [@benjervis](https://github.com/benjervis)! - Make the sprinkles runtime more resilient to mutated prototypes.

  Previously the createSprinkles function used a `for ... in` loop on an array, which creates problems when used in an environment that has monkeypatched the Array prototype improperly.
  By switching to more original style for loops, this should be fixed.

## 1.4.0

### Minor Changes

- [#605](https://github.com/seek-oss/vanilla-extract/pull/605) [`81a3d98`](https://github.com/seek-oss/vanilla-extract/commit/81a3d98b3fb36660406a59049e1cd464418b00fc) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Support boolean conditional values, e.g. `{ mobile: false, desktop: true }`

## 1.3.3

### Patch Changes

- [#520](https://github.com/seek-oss/vanilla-extract/pull/520) [`b294764`](https://github.com/seek-oss/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 1.3.2

### Patch Changes

- [#508](https://github.com/seek-oss/vanilla-extract/pull/508) [`d15e783`](https://github.com/seek-oss/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 1.3.1

### Patch Changes

- [#432](https://github.com/seek-oss/vanilla-extract/pull/432) [`8641738`](https://github.com/seek-oss/vanilla-extract/commit/8641738e20ec6c94804c49ee767b1a7d27efe8ad) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix handling of zero values in shorthands

## 1.3.0

### Minor Changes

- [#360](https://github.com/seek-oss/vanilla-extract/pull/360) [`4ceb76e`](https://github.com/seek-oss/vanilla-extract/commit/4ceb76efd8063cb833e2f63a708968d054f76dc0) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Clean up public API, deprecating old API names. Also adding sprinkles to the docs site and using `sprinkles` in favour of `atoms` for the canoncial examples.

  API changes include:

  - Rename `createAtomicStyles` to `defineProperties`, `createAtomicStyles` is now deprecated
  - Rename `createAtomsFn` to `createSprinkles`, `createAtomsFn` is now deprecated
  - Rename `AtomicStyles` type to `SprinklesProperties`, `AtomicStyles` is now deprecated

  ### Migration Guide

  ```diff
  -import { createAtomicStyles, createAtomsFn } from '@vanilla-extract/sprinkles';
  +import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

  -const responsiveProperties = createAtomicStyles({
  +const responsiveProperties = defineProperties({
    conditions: {
      mobile: {},
      tablet: { '@media': 'screen and (min-width: 768px)' },
      desktop: { '@media': 'screen and (min-width: 1024px)' }
    },
    defaultCondition: 'mobile',
    properties: {
      display: ['none', 'block', 'flex'],
      flexDirection: ['row', 'column'],
      padding: space
      // etc.
    }
  });

  -export const sprinkles = createAtomsFn(responsiveProperties);
  +export const sprinkles = createSprinkles(responsiveProperties);
  ```

## 1.2.0

### Minor Changes

- [#334](https://github.com/seek-oss/vanilla-extract/pull/334) [`0d8efe2`](https://github.com/seek-oss/vanilla-extract/commit/0d8efe2e782bfc8d02485a19b9e3be4fa5bf7302) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Support multiple default conditions

  If your conditions are mutually exclusive (e.g. light mode and dark mode), you can now provide an array of default conditions. For example, the following configuration would automatically expand `atoms({ background: 'white' })` to the equivalent of `atoms({ background: { lightMode: 'white', darkMode: 'white' }})`.

  ```ts
  import { createAtomicStyles } from '@vanilla-extract/sprinkles';

  const responsiveStyles = createAtomicStyles({
    conditions: {
      lightMode: { '@media': '(prefers-color-scheme: light)' },
      darkMode: { '@media': '(prefers-color-scheme: dark)' },
    },
    defaultCondition: ['lightMode', 'darkMode'],
    // etc.
  });
  ```

## 1.1.3

### Patch Changes

- [#331](https://github.com/seek-oss/vanilla-extract/pull/331) [`30f3ba3`](https://github.com/seek-oss/vanilla-extract/commit/30f3ba3f702b8a9eab8bee3bbfe0e571ccd65bd8) Thanks [@markdalgleish](https://github.com/markdalgleish)! - `createMapValueFn`: Support mapping values to `boolean`, `null` and `undefined`

## 1.1.2

### Patch Changes

- [#326](https://github.com/seek-oss/vanilla-extract/pull/326) [`2d9b4c3`](https://github.com/seek-oss/vanilla-extract/commit/2d9b4c3e711310e55dbefe4b3430a771d95d62fd) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Avoid calling `composeStyles` when using the atoms function at runtime

## 1.1.1

### Patch Changes

- [#307](https://github.com/seek-oss/vanilla-extract/pull/307) [`a8f181d`](https://github.com/seek-oss/vanilla-extract/commit/a8f181daa12ced5958c57bac61370726e751e1e2) Thanks [@rtkaaho](https://github.com/rtkaaho)! - Allow style objects to be passed when no conditions are present

## 1.1.0

### Minor Changes

- [#303](https://github.com/seek-oss/vanilla-extract/pull/303) [`e67e673`](https://github.com/seek-oss/vanilla-extract/commit/e67e673c071d3cbd7dafe4fb5667d37395c03a6b) Thanks [@rtkaaho](https://github.com/rtkaaho)! - Support passing style objects as property values.

  For more complicated styles, values can now be entire style objects. This works especially well when combined with CSS Variables.

  ```ts
  import { createVar } from '@vanilla-extract/css';
  import { createAtomicStyles } from '@vanilla-extract/sprinkles';

  const alpha = createVar();

  const responsiveStyles = createAtomicStyles({
    properties: {
      background: {
        red: {
          vars: { [alpha]: '1' },
          background: `rgba(255, 0, 0, ${alpha})`,
        },
      },
      backgroundOpacity: {
        1: { vars: { [alpha]: '1' } },
        0.1: { vars: { [alpha]: '0.1' } },
      },
      // etc.
    },
  });
  ```

## 1.0.0

### Major Changes

- [#261](https://github.com/seek-oss/vanilla-extract/pull/261) [`3db8c11`](https://github.com/seek-oss/vanilla-extract/commit/3db8c115ebf17885113de9eae6f794710c217a9c) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release Sprinkles v1

### Minor Changes

- [#259](https://github.com/seek-oss/vanilla-extract/pull/259) [`b8a6441`](https://github.com/seek-oss/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Allow the result of calling `atoms` to be used in selectors

  Sprinkles now uses vanilla-extract’s updated [`composeStyles`](https://github.com/seek-oss/vanilla-extract#composestyles) function internally, which means that atomic styles can be treated as if they were a single class within vanilla-extract selectors.

  ```ts
  // styles.css.ts
  import { globalStyle } from '@vanilla-extract/css';
  import { atoms } from './sprinkles.css.ts';

  export const container = atoms({
    padding: 'small',
  });

  globalStyle(`${container} *`, {
    boxSizing: 'border-box',
  });
  ```

### Patch Changes

- Updated dependencies [[`b8a6441`](https://github.com/seek-oss/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a)]:
  - @vanilla-extract/css@1.2.0

## 0.4.4

### Patch Changes

- [#252](https://github.com/seek-oss/vanilla-extract/pull/252) [`b9b3451`](https://github.com/seek-oss/vanilla-extract/commit/b9b3451d9bab49a712fae95c22b2ee9d8af5f2c5) Thanks [@graup](https://github.com/graup)! - Fix `Exported variable 'Box' has or is using name 'ResponsiveArray' from external module` error ([#250](https://github.com/seek-oss/vanilla-extract/issues/250))

## 0.4.3

### Patch Changes

- [#210](https://github.com/seek-oss/vanilla-extract/pull/210) [`500eaad`](https://github.com/seek-oss/vanilla-extract/commit/500eaade897abd800163d2d8db3c679bc3776cf7) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix bug where `responsiveArray` with a length of 4 was considered invalid

## 0.4.2

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/css@1.0.0

## 0.4.1

### Patch Changes

- [#159](https://github.com/seek-oss/vanilla-extract/pull/159) [`ef22274`](https://github.com/seek-oss/vanilla-extract/commit/ef22274cc83955072d4008fd3c79359844e666e9) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Always return `ConditionalValue` type from `normalizeValue` and `mapValue` functions

## 0.4.0

### Minor Changes

- [#157](https://github.com/seek-oss/vanilla-extract/pull/157) [`ba65efc`](https://github.com/seek-oss/vanilla-extract/commit/ba65efce92c3034d6994c26f0e20eef0f98b94be) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `RequiredConditionalValue` type

### Patch Changes

- [#158](https://github.com/seek-oss/vanilla-extract/pull/158) [`98907f9`](https://github.com/seek-oss/vanilla-extract/commit/98907f9103078b45f862efc7e04b716061e9de93) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Ensure `normalizeConditionalValue` and `mapConditionalValue` return `RequiredConditionalValue` types when a `RequiredConditionalValue` type is provided

- Updated dependencies [[`f5ab957`](https://github.com/seek-oss/vanilla-extract/commit/f5ab957b34586886ef428b58de1f2b55b4ab65e0), [`ae532f5`](https://github.com/seek-oss/vanilla-extract/commit/ae532f5a112c0e89a510fea224b43c6706ce6ac2)]:
  - @vanilla-extract/css@0.5.2

## 0.3.2

### Patch Changes

- [#150](https://github.com/seek-oss/vanilla-extract/pull/150) [`e59002a`](https://github.com/seek-oss/vanilla-extract/commit/e59002ae75faeaeaa585b71eafca8ee1ebf85849) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Refactor responsive array type to use Tuple generic

## 0.3.1

### Patch Changes

- [#139](https://github.com/seek-oss/vanilla-extract/pull/139) [`152a1c7`](https://github.com/seek-oss/vanilla-extract/commit/152a1c7e3a29cc074f73c37d81428a75705057b9) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ignore undefined values in conditional objects

## 0.3.0

### Minor Changes

- [#132](https://github.com/seek-oss/vanilla-extract/pull/132) [`4f92126`](https://github.com/seek-oss/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `createMapValueFn` and `createNormalizeValueFn` utilities and `ConditionalValue` type.

### Patch Changes

- Updated dependencies [[`ed76e45`](https://github.com/seek-oss/vanilla-extract/commit/ed76e450038cb7cbaf12a511fda9e2a3a6d21b96), [`4f92126`](https://github.com/seek-oss/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166)]:
  - @vanilla-extract/css@0.5.0

## 0.2.2

### Patch Changes

- [#100](https://github.com/seek-oss/vanilla-extract/pull/100) [`9edf2df`](https://github.com/seek-oss/vanilla-extract/commit/9edf2dfc2fa05720d267732b88f07e0d53131ef3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow readonly arrays for responsive array properties

## 0.2.1

### Patch Changes

- [#98](https://github.com/seek-oss/vanilla-extract/pull/98) [`45a6eef`](https://github.com/seek-oss/vanilla-extract/commit/45a6eeff8548db3841615e38589f57cbd526ea8a) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix some minor type issues

  - Better support passing config to `createAtomicStyles` that was not defined inline
  - Remove array methods being exposed on properties using number arrays

## 0.2.0

### Minor Changes

- [#81](https://github.com/seek-oss/vanilla-extract/pull/81) [`717ad60`](https://github.com/seek-oss/vanilla-extract/commit/717ad60e8f6770246aaaedc1760791bb0e7d19cc) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add static `properties` set to atoms function

  This allows runtime code to detect whether a given property can be handled by the atoms function or not.

  This is useful when building a Box component with atoms available at the top level (e.g. `<Box padding="small">`) since you'll need some way to filter atom props from non-atom props.

## 0.1.2

### Patch Changes

- [#77](https://github.com/seek-oss/vanilla-extract/pull/77) [`63c01ad`](https://github.com/seek-oss/vanilla-extract/commit/63c01ada07dd268c8d3cbe62dcf1baa8842216f2) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve runtime errors

  Sprinkles will now validate your `atoms` calls at runtime for a better developer experience. The validation code should be stripped from production bundles via a `process.env.NODE_ENV` check.

  Example Error

  ```bash
  SprinklesError: "paddingTop" has no value "xlarge". Possible values are "small", "medium", "large"
  ```

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
