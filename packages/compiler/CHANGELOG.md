# @vanilla-extract/compiler

## 0.3.1

### Patch Changes

- [#1624](https://github.com/vanilla-extract-css/vanilla-extract/pull/1624) [`50f1234`](https://github.com/vanilla-extract-css/vanilla-extract/commit/50f12348894a9e77a36ec269fcdf2ad159e5211d) Thanks [@BPScott](https://github.com/BPScott)! - Include `^7.0.0` in `vite` dependency range

## 0.3.0

### Minor Changes

- [#1614](https://github.com/vanilla-extract-css/vanilla-extract/pull/1614) [`4e92cce`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4e92ccee6d7b0c2ee16163446e5938c7365224b3) Thanks [@askoufis](https://github.com/askoufis)! - Add new `getAllCss` API

  The `Compiler` class now provides a `getAllCss` method that returns all the CSS currently stored by the compiler.

  **EXAMPLE USAGE**:

  ```ts
  import { createCompiler } from '@vanilla-extract/compiler';

  const compiler = createCompiler({
    root: process.cwd()
  });

  await compiler.processVanillaFile('foo.css.ts');
  await compiler.processVanillaFile('bar.css.ts');

  // Contains all CSS created by `foo.css.ts` and `bar.css.ts`
  const allCss = compiler.getAllCss();
  ```

## 0.2.3

### Patch Changes

- [#1610](https://github.com/vanilla-extract-css/vanilla-extract/pull/1610) [`2b0be1b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2b0be1be15dcdc3df3248305fe80e566cce794cd) Thanks [@askoufis](https://github.com/askoufis)! - Revert "Improve ESM package entrypoints (#1597)" to fix `Named export not found` error when importing ESM entrypoints

- Updated dependencies [[`2b0be1b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2b0be1be15dcdc3df3248305fe80e566cce794cd)]:
  - @vanilla-extract/css@1.17.4
  - @vanilla-extract/integration@8.0.4

## 0.2.2

### Patch Changes

- [#1605](https://github.com/vanilla-extract-css/vanilla-extract/pull/1605) [`9bf58ee`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9bf58ee1e9a8371f4ddc245b0a96afcfcf5eac29) Thanks [@sapphi-red](https://github.com/sapphi-red)! - Update `vite-node` dependency to `^3.2.2`

## 0.2.1

### Patch Changes

- [#1597](https://github.com/vanilla-extract-css/vanilla-extract/pull/1597) [`a7fccf8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a7fccf8a2626d610c060e095e0b9fb48a4ca5c9e) Thanks [@drwpow](https://github.com/drwpow)! - Fix ESM import path

- Updated dependencies [[`f0533be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f0533be939e6835ae961e3dd10b764c0c052ee75), [`a7fccf8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a7fccf8a2626d610c060e095e0b9fb48a4ca5c9e)]:
  - @vanilla-extract/css@1.17.3
  - @vanilla-extract/integration@8.0.3

## 0.2.0

### Minor Changes

- [#1592](https://github.com/vanilla-extract-css/vanilla-extract/pull/1592) [`35d6b3f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/35d6b3fe5d297dc76f1629a9f54f21d0f97e7c9f) Thanks [@askoufis](https://github.com/askoufis)! - `createCompiler`: Add `enableFileWatcher` option

  By default, the compiler sets up its own file watcher.
  This option allows you to disable it if necessary, such as during a production build.

  **EXAMPLE USAGE**:

  ```ts
  const compiler = createCompiler({
    root: process.cwd(),
    enableFileWatcher: false
  });
  ```

## 0.1.3

### Patch Changes

- [#1583](https://github.com/vanilla-extract-css/vanilla-extract/pull/1583) [`6488e28`](https://github.com/vanilla-extract-css/vanilla-extract/commit/6488e28337106582231b418778c884f26e393219) Thanks [@askoufis](https://github.com/askoufis)! - Ignore Vite `base` config

  Fixes a bug where imported asset URLs would be transformed by the compiler when setting the `base` option in Vite, resulting in incorrect resolution and bundling of these assets during the build process.

- Updated dependencies [[`134117d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/134117d32e25d92edc24c8c863d757294d7b5df8), [`c66be53`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c66be53d600802b2922da1d6034e2a5ff3fbbcae)]:
  - @vanilla-extract/css@1.17.2
  - @vanilla-extract/integration@8.0.2

## 0.1.2

### Patch Changes

- Updated dependencies [[`965fd03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/965fd03ff26dd324ec24734aa7700f1fe89bd483)]:
  - @vanilla-extract/integration@8.0.1

## 0.1.1

### Patch Changes

- [#1529](https://github.com/vanilla-extract-css/vanilla-extract/pull/1529) [`d5b6e70`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d5b6e70f44a3d4f03e113fe78e0605b358e9c0d7) Thanks [@askoufis](https://github.com/askoufis)! - Update `vite-node` dependency

- [#1529](https://github.com/vanilla-extract-css/vanilla-extract/pull/1529) [`d5b6e70`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d5b6e70f44a3d4f03e113fe78e0605b358e9c0d7) Thanks [@askoufis](https://github.com/askoufis)! - Include `^6.0.0` in `vite` dependency range

## 0.1.0

### Minor Changes

- [#1536](https://github.com/vanilla-extract-css/vanilla-extract/pull/1536) [`a8248be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a8248befac51aa51d771b9b22a46209b1fd1e3b3) Thanks [@askoufis](https://github.com/askoufis)! - Initial release

### Patch Changes

- Updated dependencies [[`5f66abb`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5f66abbd607e76d491bbb7b9bfe9c64c882a53e8), [`a8248be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a8248befac51aa51d771b9b22a46209b1fd1e3b3), [`c432ff3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c432ff33a8aead2c94fa6a4fcc9fcb1d7990427d), [`ec0b024`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ec0b024fd19c133c233445f9e860626d104f9d97), [`a8248be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a8248befac51aa51d771b9b22a46209b1fd1e3b3)]:
  - @vanilla-extract/integration@8.0.0
  - @vanilla-extract/css@1.17.1
