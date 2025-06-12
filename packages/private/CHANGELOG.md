# @vanilla-extract/private

## 1.0.9

### Patch Changes

- [#1610](https://github.com/vanilla-extract-css/vanilla-extract/pull/1610) [`2b0be1b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2b0be1be15dcdc3df3248305fe80e566cce794cd) Thanks [@askoufis](https://github.com/askoufis)! - Revert "Improve ESM package entrypoints (#1597)" to fix `Named export not found` error when importing ESM entrypoints

## 1.0.8

### Patch Changes

- [#1567](https://github.com/vanilla-extract-css/vanilla-extract/pull/1567) [`9d16de8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9d16de85b149b531f2e049e8d93bdb862667ff1f) Thanks [@andjsrk](https://github.com/andjsrk)! - Simplify `CSSVarFunction` type

- [#1597](https://github.com/vanilla-extract-css/vanilla-extract/pull/1597) [`a7fccf8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a7fccf8a2626d610c060e095e0b9fb48a4ca5c9e) Thanks [@drwpow](https://github.com/drwpow)! - Fix ESM import path

## 1.0.7

### Patch Changes

- [#1557](https://github.com/vanilla-extract-css/vanilla-extract/pull/1557) [`134117d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/134117d32e25d92edc24c8c863d757294d7b5df8) Thanks [@askoufis](https://github.com/askoufis)! - Simplify `CSSVarFunction` type to improve type-checking performance

## 1.0.6

### Patch Changes

- [#1463](https://github.com/vanilla-extract-css/vanilla-extract/pull/1463) [`61878f5fb21a33190ef242551c639e216ba4748a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/61878f5fb21a33190ef242551c639e216ba4748a) Thanks [@askoufis](https://github.com/askoufis)! - Export types with `export { type T }` syntax

## 1.0.5

### Patch Changes

- [#1335](https://github.com/vanilla-extract-css/vanilla-extract/pull/1335) [`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17) Thanks [@askoufis](https://github.com/askoufis)! - Add `types` field to `package.json`

## 1.0.4

### Patch Changes

- [#1368](https://github.com/vanilla-extract-css/vanilla-extract/pull/1368) [`90f0315`](https://github.com/vanilla-extract-css/vanilla-extract/commit/90f03153bb7c4a8d5b448eab228c46203e9cdaed) Thanks [@askoufis](https://github.com/askoufis)! - **walkObject**: Use an empty object to initialize a clone instead of calling the input object's `constructor`

  This allows `walkObject` to be used on module namespace objects:

  ```ts
  import { walkObject } from '@vanilla-extract/private';
  import * as ns from './foo';

  // Runtime error in `vite-node`
  walkObject(ns, myMappingFunction);
  ```

  The previous implementation did not work with these objects because [they do not have a `constructor` function][es6 spec].
  `esbuild` seems to have papered over this issue by providing a `constructor` function on these objects, but this seems to not be the case with `vite-node`, hence the need for this fix.

  [es6 spec]: https://262.ecma-international.org/6.0/#sec-module-namespace-objects

## 1.0.3

### Patch Changes

- [#520](https://github.com/vanilla-extract-css/vanilla-extract/pull/520) [`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 1.0.2

### Patch Changes

- [#489](https://github.com/vanilla-extract-css/vanilla-extract/pull/489) [`0c1ec7d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix theme contract types in TypeScript 4.5

## 1.0.1

### Patch Changes

- [#235](https://github.com/vanilla-extract-css/vanilla-extract/pull/235) [`1e49dfc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createGlobalTheme` types when accepting an existing contract

## 1.0.0

### Major Changes

- [#171](https://github.com/vanilla-extract-css/vanilla-extract/pull/171) [`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

## 0.1.2

### Patch Changes

- [#84](https://github.com/vanilla-extract-css/vanilla-extract/pull/84) [`0bc4e0a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Validate tokens match corresponding theme contracts

## 0.1.1

### Patch Changes

- [#45](https://github.com/vanilla-extract-css/vanilla-extract/pull/45) [`e154028`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createThemeVars` when using null values
