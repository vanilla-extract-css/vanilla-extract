# @vanilla-extract/css

## 0.2.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#25](https://github.com/seek-oss/vanilla-extract/pull/25) [`c4bedd5`](https://github.com/seek-oss/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460) Thanks [@markdalgleish](https://github.com/markdalgleish)! - The `createInlineTheme` function has now moved to the `@vanilla-extract/dynamic` package.

  ```diff
  -import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
  +import { createInlineTheme } from '@vanilla-extract/dynamic';
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
