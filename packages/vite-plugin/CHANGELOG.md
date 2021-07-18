# @vanilla-extract/vite-plugin

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/integration@1.0.0

## 0.1.1

### Patch Changes

- [#96](https://github.com/seek-oss/vanilla-extract/pull/96) [`697a233`](https://github.com/seek-oss/vanilla-extract/commit/697a2332cdb34886af26224c13f1efb73b6d36b3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Change vite-plugin to be a named export

  BREAKING CHANGE

  ```diff
  -import vanillaExtractPlugin from '@vanilla-extract/vite-plugin';
  +import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

  // vite.config.js
  export default {
    plugins: [vanillaExtractPlugin()]
  }
  ```
