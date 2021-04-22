# @vanilla-extract/webpack-plugin

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
