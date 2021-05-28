# @vanilla-extract/esbuild-plugin

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/integration@1.0.0

## 0.2.2

### Patch Changes

- [#134](https://github.com/seek-oss/vanilla-extract/pull/134) [`b99dd0a`](https://github.com/seek-oss/vanilla-extract/commit/b99dd0a2d6ce171b4776aa11d0ab2c7e1559ddae) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Move shared logic to integration package

## 0.2.1

### Patch Changes

- [#68](https://github.com/seek-oss/vanilla-extract/pull/68) [`0cfd17d`](https://github.com/seek-oss/vanilla-extract/commit/0cfd17d89b3bb6ad4ae4f5bb05dce9015a33840e) Thanks [@jahredhope](https://github.com/jahredhope)! - Fix errors occurring when using TypeScript in .css.ts files

## 0.2.0

### Minor Changes

- [#53](https://github.com/seek-oss/vanilla-extract/pull/53) [`58e4f8a`](https://github.com/seek-oss/vanilla-extract/commit/58e4f8aa6a2c56c5f26408539756529705a598b8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support exporting functions from `.css.ts` files via recipes

### Patch Changes

- Updated dependencies [[`48c4a78`](https://github.com/seek-oss/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656), [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d)]:
  - @vanilla-extract/css@0.4.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`156b491`](https://github.com/seek-oss/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a), [`ae9864c`](https://github.com/seek-oss/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6), [`756d9b0`](https://github.com/seek-oss/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b)]:
  - @vanilla-extract/css@0.3.0

## 0.1.1

### Patch Changes

- [#30](https://github.com/seek-oss/vanilla-extract/pull/30) [`b4591d5`](https://github.com/seek-oss/vanilla-extract/commit/b4591d568796ac7d79a588d0e7ad453dc45532f8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix hash context information not being applied

  This change makes it so all files with a valid CSS file extension (e.g. `.css.ts`) get hash context information (internally referred to as `filescope`) applied. This fixes some situations where the "New styles cannot be registered dynamically after initial boot" error would occur incorrectly.

## 0.1.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove `projectRoot` option in favor of `package.json` resolution

### Patch Changes

- Updated dependencies [[`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5), [`c4bedd5`](https://github.com/seek-oss/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460)]:
  - @vanilla-extract/css@0.2.0

## 0.0.2

### Patch Changes

- [#16](https://github.com/seek-oss/vanilla-extract/pull/16) [`ebb3edc`](https://github.com/seek-oss/vanilla-extract/commit/ebb3edc5a9048559410e5fbbadf82a9de799bb09) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Trigger rebuild for CSS file dependencies
