# @vanilla-extract/babel-plugin

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
