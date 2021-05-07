# @vanilla-extract/vite-plugin

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
