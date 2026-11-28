# @vanilla-extract/turbopack-plugin

## 1.0.0

### Major Changes

- [#1815](https://github.com/vanilla-extract-css/vanilla-extract/pull/1815) [`cb1f150`](https://github.com/vanilla-extract-css/vanilla-extract/commit/cb1f150b823f9a321b6fb517862c94e0fcbf04d3) Thanks [@askoufis](https://github.com/askoufis)! - Drop support for Next.js versions below 16
  
  **BREAKING CHANGE**: The minimum supported version of `next` is now `^16.0.0`. The `semver` dependency has been removed, and `unstable_turbopack.mode` `'auto'` now always enables Turbopack config since Next.js version detection is no longer required. Please note that turbopack support is still experimental.
  
  **MIGRATION GUIDE**: Upgrade to Next.js 16 or later.

### Patch Changes

- [#1800](https://github.com/vanilla-extract-css/vanilla-extract/pull/1800) [`e690192`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e69019273a807f1c4a4656b7928536b62054598a) Thanks [@aevarOrigo](https://github.com/aevarOrigo)! - Support Next.js 16.4+ when importing images from `.css.ts` files
  
  Previously, builds failed with `TypeError: getImageSize is not a function`.
- Updated dependencies [[`e6bc070`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e6bc0706a2ed1db1eddacf58fd494c381d5eec92)]:
  - @vanilla-extract/compiler@0.8.0

## 0.1.4

### Patch Changes

- [#1783](https://github.com/vanilla-extract-css/vanilla-extract/pull/1783) [`ad14778`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ad14778a2edd1944d9bf9cac76afe669d9cbd3a9) Thanks [@mpsq](https://github.com/mpsq)! - perf: Don't invalidate the compiler's module graph each time a file is processed during production builds

## 0.1.3

### Patch Changes

- Updated dependencies [[`1677593`](https://github.com/vanilla-extract-css/vanilla-extract/commit/16775939763349513c527b2f33398a03d7d75057)]:
  - @vanilla-extract/compiler@0.7.0

## 0.1.2

### Patch Changes

- Updated dependencies [[`b066d1c`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b066d1c253ee09f2967bfddd7b6762f5dfa2d7d7)]:
  - @vanilla-extract/compiler@0.6.0

## 0.1.1

### Patch Changes

- Updated dependencies [[`e29f242`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e29f242953fcb46315cebe5b3374a5a1f89d93af)]:
  - @vanilla-extract/compiler@0.5.0

## 0.1.0

### Minor Changes

- [#1686](https://github.com/vanilla-extract-css/vanilla-extract/pull/1686) [`1a63a60`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1a63a600b7a707f9317ce5f6607998eba4eb9c99) Thanks [@askoufis](https://github.com/askoufis)! - Initial release

### Patch Changes

- Updated dependencies [[`c0e2812`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c0e2812f532f934d52c4728a0a167327420ff6f1), [`c0e2812`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c0e2812f532f934d52c4728a0a167327420ff6f1), [`c0e2812`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c0e2812f532f934d52c4728a0a167327420ff6f1)]:
  - @vanilla-extract/compiler@0.4.0
  - @vanilla-extract/integration@8.0.8
