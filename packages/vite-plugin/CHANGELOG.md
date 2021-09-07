# @vanilla-extract/vite-plugin

## 2.0.2

### Patch Changes

- [#341](https://github.com/seek-oss/vanilla-extract/pull/341) [`0b743e7`](https://github.com/seek-oss/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Refactor SSR file scoping to use centralised `addFileScope` implementation

- Updated dependencies [[`50bae14`](https://github.com/seek-oss/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772), [`0b743e7`](https://github.com/seek-oss/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b)]:
  - @vanilla-extract/integration@1.3.0

## 2.0.1

### Patch Changes

- [#327](https://github.com/seek-oss/vanilla-extract/pull/327) [`73b55f8`](https://github.com/seek-oss/vanilla-extract/commit/73b55f8e7e205701abdb1cbb029c3f2f5080b6fd) Thanks [@benjervis](https://github.com/benjervis)! - Fix bug where precompiled .css.ts files (.css.js) were treated differently in SSR mode.

## 2.0.0

### Major Changes

- [#323](https://github.com/seek-oss/vanilla-extract/pull/323) [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can now be configured via the `identifiers` option which accepts either `short` or `debug`.

  - `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
  - `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `somefile_mystyle_hnw5tz3`

  ```js
  import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

  vanillaExtractPlugin({ identifiers: 'short' });
  ```

  BREAKING CHANGE

  Previously identifiers were formatted as `short` when `process.env.NODE_ENV` was set to "production". By default, they will now be formatted according to Vite's [mode config](https://vitejs.dev/config/#mode).

### Patch Changes

- Updated dependencies [[`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/integration@1.2.0

## 1.2.0

### Minor Changes

- [#311](https://github.com/seek-oss/vanilla-extract/pull/311) [`416eb9a`](https://github.com/seek-oss/vanilla-extract/commit/416eb9ae99661597a8443594f4376aacf4d295cc) Thanks [@mattcompiles](https://github.com/mattcompiles)! - In SSR mode, move to runtime evaluation of vanilla-extract files

  This unlocks the potential for CSS extraction on the server.

## 1.1.2

### Patch Changes

- [#290](https://github.com/seek-oss/vanilla-extract/pull/290) [`adc1d64`](https://github.com/seek-oss/vanilla-extract/commit/adc1d644635a1197edd36f522f78658a641027d4) Thanks [@ygj6](https://github.com/ygj6)! - Normalize path of generated CSS files

## 1.1.1

### Patch Changes

- [#270](https://github.com/seek-oss/vanilla-extract/pull/270) [`fe19158`](https://github.com/seek-oss/vanilla-extract/commit/fe1915808b374a1bbf8f67eca85c0253153e2cb9) Thanks [@yyx990803](https://github.com/yyx990803)! - Fix watching of modules imported by `.css.ts` files

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

- Updated dependencies [[`b8a6441`](https://github.com/seek-oss/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a)]:
  - @vanilla-extract/integration@1.1.0

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
