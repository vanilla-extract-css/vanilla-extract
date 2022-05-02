# @vanilla-extract/webpack-plugin

## 2.1.9

### Patch Changes

- [#647](https://github.com/seek-oss/vanilla-extract/pull/647) [`3c9b7d9`](https://github.com/seek-oss/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Use more realistic file paths for virtual CSS files

- Updated dependencies [[`3c9b7d9`](https://github.com/seek-oss/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636)]:
  - @vanilla-extract/integration@4.0.0

## 2.1.8

### Patch Changes

- [#634](https://github.com/seek-oss/vanilla-extract/pull/634) [`69b8460`](https://github.com/seek-oss/vanilla-extract/commit/69b846015ecada3354ea292e1276e5da560923c6) Thanks [@phil-lgr](https://github.com/phil-lgr)! - Add fileName to the CSS virtual loader params

  This allows users to identify the source file for vanilla-extract css imports

## 2.1.7

### Patch Changes

- [#645](https://github.com/seek-oss/vanilla-extract/pull/645) [`5ebca75`](https://github.com/seek-oss/vanilla-extract/commit/5ebca758d18e7d55d0c079c00178cb14e936ac2e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Bump `@vanilla-extract/integration` dep

## 2.1.6

### Patch Changes

- [#621](https://github.com/seek-oss/vanilla-extract/pull/621) [`bec1cd8`](https://github.com/seek-oss/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9) Thanks [@nayaabkhan](https://github.com/nayaabkhan)! - Improve build performance when creating large CSS files

- Updated dependencies [[`bec1cd8`](https://github.com/seek-oss/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4)]:
  - @vanilla-extract/integration@3.0.0

## 2.1.5

### Patch Changes

- [#543](https://github.com/seek-oss/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/integration@2.0.1

## 2.1.4

### Patch Changes

- Updated dependencies [[`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69)]:
  - @vanilla-extract/integration@2.0.0

## 2.1.3

### Patch Changes

- [#508](https://github.com/seek-oss/vanilla-extract/pull/508) [`d15e783`](https://github.com/seek-oss/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 2.1.2

### Patch Changes

- [#492](https://github.com/seek-oss/vanilla-extract/pull/492) [`f2d2d9e`](https://github.com/seek-oss/vanilla-extract/commit/f2d2d9eea18dcd4ffec694f8056a78d850485592) Thanks [@benjervis](https://github.com/benjervis)! - Fix requiring of webpack loader

  Previously, the webpack plugin would reference itself as a loader by requiring `@vanilla-extract/webpack-plugin/loader`, but this was technically incorrect, and only worked because of the flat node_modules structure that yarn provides.

  When using a package manager like pnpm, which does not have a flat structure, this breaks.

  This change uses relative references internally to ensure that the loader can always be required.

## 2.1.1

### Patch Changes

- [#459](https://github.com/seek-oss/vanilla-extract/pull/459) [`2719dc0`](https://github.com/seek-oss/vanilla-extract/commit/2719dc0b75172bb43648ddf2a3f2f31f58e42426) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove unused files and dependencies

* [#459](https://github.com/seek-oss/vanilla-extract/pull/459) [`2719dc0`](https://github.com/seek-oss/vanilla-extract/commit/2719dc0b75172bb43648ddf2a3f2f31f58e42426) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove "Styles detected outside of '.css.(ts/js)' files" error

  This error could occasionally cause false positives, and was inconsistent with the rest of the integrations.

## 2.1.0

### Minor Changes

- [#341](https://github.com/seek-oss/vanilla-extract/pull/341) [`0b743e7`](https://github.com/seek-oss/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - No longer require Babel to be run on .css.ts files

  Previously, the `@vanilla-extract/webpack-plugin` required the `@vanilla-extract/babel-plugin` to be run over .css.ts files. In order to bring webpack inline with the other integrations, the `@vanilla-extract/webpack-plugin` can now be used without Babel.

  Note: Automatic debug IDs still require the `@vanilla-extract/babel-plugin`.

### Patch Changes

- Updated dependencies [[`50bae14`](https://github.com/seek-oss/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772), [`0b743e7`](https://github.com/seek-oss/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b)]:
  - @vanilla-extract/integration@1.3.0

## 2.0.0

### Major Changes

- [#323](https://github.com/seek-oss/vanilla-extract/pull/323) [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can now be configured via the `identifiers` option which accepts either `short` or `debug`.

  - `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
  - `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `somefile_mystyle_hnw5tz3`

  ```js
  import { vanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

  vanillaExtractPlugin({ identifiers: 'short' });
  ```

  BREAKING CHANGE

  Previously identifiers were formatted as `short` when `process.env.NODE_ENV` was set to "production". By default, they will now be formatted according to webpack's [mode config](https://webpack.js.org/configuration/mode/).

### Patch Changes

- Updated dependencies [[`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/integration@1.2.0

## 1.1.0

### Minor Changes

- [#259](https://github.com/seek-oss/vanilla-extract/pull/259) [`b8a6441`](https://github.com/seek-oss/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Allow the result of `composeStyles` to be used in selectors

  When style compositions are used in selectors, they are now assigned an additional class so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

  ```ts
  import { style, globalStyle, composeStyles } from '@vanilla-extract/css';

  const background = style({ background: 'mintcream' });
  const padding = style({ padding: 12 });

  export const container = composeStyles(background, padding);

  globalStyle(`${container} *`, {
    boxSizing: 'border-box',
  });
  ```

### Patch Changes

- [#260](https://github.com/seek-oss/vanilla-extract/pull/260) [`c3d9d78`](https://github.com/seek-oss/vanilla-extract/commit/c3d9d7843cc9cf1d326c8f3ae1d2bd1294cf1b0c) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove unused compiler cache

- Updated dependencies [[`b8a6441`](https://github.com/seek-oss/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a)]:
  - @vanilla-extract/integration@1.1.0

## 1.0.3

### Patch Changes

- [#208](https://github.com/seek-oss/vanilla-extract/pull/208) [`a1c79fc`](https://github.com/seek-oss/vanilla-extract/commit/a1c79fc10c5cf7f30dce0269f9183dfd4f2456e9) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Deprecate redundant `allowRuntime` option

## 1.0.2

### Patch Changes

- [#195](https://github.com/seek-oss/vanilla-extract/pull/195) [`1099b34`](https://github.com/seek-oss/vanilla-extract/commit/1099b34437757522799c26bec7471df209ef9b36) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue when @vanilla-extract/webpack-plugin is nested within a separate node_modules folder

## 1.0.1

### Patch Changes

- [#181](https://github.com/seek-oss/vanilla-extract/pull/181) [`7a63af8`](https://github.com/seek-oss/vanilla-extract/commit/7a63af8212edfb842261db4d1cca88cce8612764) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where CSS can be duplicated in some scenarios

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/integration@1.0.0

## 0.3.1

### Patch Changes

- [#134](https://github.com/seek-oss/vanilla-extract/pull/134) [`b99dd0a`](https://github.com/seek-oss/vanilla-extract/commit/b99dd0a2d6ce171b4776aa11d0ab2c7e1559ddae) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Move shared logic to integration package

## 0.3.0

### Minor Changes

- [#53](https://github.com/seek-oss/vanilla-extract/pull/53) [`58e4f8a`](https://github.com/seek-oss/vanilla-extract/commit/58e4f8aa6a2c56c5f26408539756529705a598b8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support exporting functions from `.css.ts` files via recipes

### Patch Changes

- Updated dependencies [[`48c4a78`](https://github.com/seek-oss/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656), [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d)]:
  - @vanilla-extract/css@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`156b491`](https://github.com/seek-oss/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a), [`ae9864c`](https://github.com/seek-oss/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6), [`756d9b0`](https://github.com/seek-oss/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b)]:
  - @vanilla-extract/css@0.3.0

## 0.2.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

### Patch Changes

- Updated dependencies [[`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5), [`c4bedd5`](https://github.com/seek-oss/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460)]:
  - @vanilla-extract/css@0.2.0

## 0.1.0

### Minor Changes

- e83ad50: Initial release

### Patch Changes

- Updated dependencies [e83ad50]
  - @vanilla-extract/css@0.1.0
