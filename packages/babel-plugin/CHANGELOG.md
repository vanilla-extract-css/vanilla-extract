# @vanilla-extract/babel-plugin

## 1.1.4

### Patch Changes

- [#543](https://github.com/seek-oss/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/integration@2.0.1

## 1.1.3

### Patch Changes

- Updated dependencies [[`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69)]:
  - @vanilla-extract/integration@2.0.0

## 1.1.2

### Patch Changes

- [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Handle vite 2.6.

  As of vite 2.6 and greater, `?used` gets appended to css imports, which causes the file imports to be not what we expected.

  This caused mismatching classnames in the vite plugin, and it caused the babel plugin to not add filescopes when it should have.

- Updated dependencies [[`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0)]:
  - @vanilla-extract/integration@1.4.3

## 1.1.1

### Patch Changes

- [#391](https://github.com/seek-oss/vanilla-extract/pull/391) [`c0fa901`](https://github.com/seek-oss/vanilla-extract/commit/c0fa9019e0717f35cade939c7a9b665344cbf7a9) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Handle array destructuring from `createTheme` when it's already been compiled

## 1.1.0

### Minor Changes

- [#348](https://github.com/seek-oss/vanilla-extract/pull/348) [`c6cd1f2`](https://github.com/seek-oss/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add debug IDs to `recipe` function

### Patch Changes

- Updated dependencies [[`c6cd1f2`](https://github.com/seek-oss/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42)]:
  - @vanilla-extract/integration@1.4.0

## 1.0.1

### Patch Changes

- [#243](https://github.com/seek-oss/vanilla-extract/pull/243) [`93b40df`](https://github.com/seek-oss/vanilla-extract/commit/93b40df5d5c738e2ad3051857cfb6b452d0ac274) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Correctly insert debugId within nested call expressions and sequence expressions

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/integration@1.0.0

## 0.4.2

### Patch Changes

- [#133](https://github.com/seek-oss/vanilla-extract/pull/133) [`a50de75`](https://github.com/seek-oss/vanilla-extract/commit/a50de7505849a317d76713d225514050a38e23e2) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve Windows support

  Normalize all file paths to POSIX format. This fixes incorrect file paths on Windows and ensures consistent hashes across all operating systems.

- Updated dependencies [[`a50de75`](https://github.com/seek-oss/vanilla-extract/commit/a50de7505849a317d76713d225514050a38e23e2)]:
  - @vanilla-extract/integration@0.1.2

## 0.4.1

### Patch Changes

- [#123](https://github.com/seek-oss/vanilla-extract/pull/123) [`72f7226`](https://github.com/seek-oss/vanilla-extract/commit/72f722674d49a5128df61045689c7a231b9f9cee) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ignore commonjs files that already have filescope information

* [#123](https://github.com/seek-oss/vanilla-extract/pull/123) [`72f7226`](https://github.com/seek-oss/vanilla-extract/commit/72f722674d49a5128df61045689c7a231b9f9cee) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Use correct import style (ESM or CJS) when adding filescope information

## 0.4.0

### Minor Changes

- [#52](https://github.com/seek-oss/vanilla-extract/pull/52) [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `createThemeVars` to `createThemeContract`

  **BREAKING CHANGE**

  ```diff
  import {
  -  createThemeVars,
  +  createThemeContract,
    createTheme
  } from '@vanilla-extract/css';

  -export const vars = createThemeVars({
  +export const vars = createThemeContract({
    color: {
      brand: null
    },
    font: {
      body: null
    }
  });
  ```

## 0.3.1

### Patch Changes

- [#41](https://github.com/seek-oss/vanilla-extract/pull/41) [`3e7d861`](https://github.com/seek-oss/vanilla-extract/commit/3e7d861187ab398eb623be751782a29d7e98144f) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where babel-plugin would cause other babel plugins to exit early

## 0.3.0

### Minor Changes

- [#37](https://github.com/seek-oss/vanilla-extract/pull/37) [`ae9864c`](https://github.com/seek-oss/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `mapToStyles` to `styleVariants`

  **BREAKING CHANGE**

  ```diff
  -import { mapToStyles } from '@vanilla-extract/css';
  +import { styleVariants } from '@vanilla-extract/css';

  -export const variant = mapToStyles({
  +export const variant = styleVariants({
    primary: { background: 'blue' },
    secondary: { background: 'aqua' },
  });
  ```

## 0.2.1

### Patch Changes

- [#30](https://github.com/seek-oss/vanilla-extract/pull/30) [`b4591d5`](https://github.com/seek-oss/vanilla-extract/commit/b4591d568796ac7d79a588d0e7ad453dc45532f8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix hash context information not being applied

  This change makes it so all files with a valid CSS file extension (e.g. `.css.ts`) get hash context information (internally referred to as `filescope`) applied. This fixes some situations where the "New styles cannot be registered dynamically after initial boot" error would occur incorrectly.

* [#30](https://github.com/seek-oss/vanilla-extract/pull/30) [`b4591d5`](https://github.com/seek-oss/vanilla-extract/commit/b4591d568796ac7d79a588d0e7ad453dc45532f8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ignore compiling files that have already been compiled

## 0.2.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove `projectRoot` and `alias` option

## 0.1.0

### Minor Changes

- e83ad50: Initial release
