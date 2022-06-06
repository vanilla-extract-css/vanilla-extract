# @vanilla-extract/vite-plugin

## 3.1.7

### Patch Changes

- [#716](https://github.com/seek-oss/vanilla-extract/pull/716) [`9b6f3ea`](https://github.com/seek-oss/vanilla-extract/commit/9b6f3ea4160c84e48172ea01b922888dbc7f7c81) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix unresolvable imports inside monorepos

* [#707](https://github.com/seek-oss/vanilla-extract/pull/707) [`162b66f`](https://github.com/seek-oss/vanilla-extract/commit/162b66fb48262182846ff71a25d541e00257672c) Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)! - Fix styles not updating in dev mode

- [#706](https://github.com/seek-oss/vanilla-extract/pull/706) [`3fc5040`](https://github.com/seek-oss/vanilla-extract/commit/3fc50406d5e57bb131eaebab42052cb1370cddff) Thanks [@graup](https://github.com/graup)! - Suppress empty sourcemap warnings

## 3.1.6

### Patch Changes

- [#673](https://github.com/seek-oss/vanilla-extract/pull/673) [`f6d5337`](https://github.com/seek-oss/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where `.css.ts` files with the same file path from other packages could have identifier collisions

- Updated dependencies [[`f6d5337`](https://github.com/seek-oss/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140)]:
  - @vanilla-extract/integration@4.0.1

## 3.1.5

### Patch Changes

- [#647](https://github.com/seek-oss/vanilla-extract/pull/647) [`3c9b7d9`](https://github.com/seek-oss/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Use more realistic file paths for virtual CSS files

- Updated dependencies [[`3c9b7d9`](https://github.com/seek-oss/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636)]:
  - @vanilla-extract/integration@4.0.0

## 3.1.4

### Patch Changes

- [#628](https://github.com/seek-oss/vanilla-extract/pull/628) [`6fa65ad`](https://github.com/seek-oss/vanilla-extract/commit/6fa65ad60b5e2aed05f1c3ab01f12c6c8f10a730) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix style imports from parent directories

## 3.1.3

### Patch Changes

- Updated dependencies [[`bec1cd8`](https://github.com/seek-oss/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4)]:
  - @vanilla-extract/integration@3.0.0

## 3.1.2

### Patch Changes

- [#543](https://github.com/seek-oss/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/integration@2.0.1

## 3.1.1

### Patch Changes

- [#530](https://github.com/seek-oss/vanilla-extract/pull/530) [`0d7f912`](https://github.com/seek-oss/vanilla-extract/commit/0d7f912e4f20f8aab0f8d00f797b91ae5005de4d) Thanks [@benjervis](https://github.com/benjervis)! - Fix compatibility issues with vite@2.7

  Vite 2.7 introduced some [breaking changes](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#270-2021-12-07) around the way SSR was indicated in plugins.
  The plugin has been updated to handle both the old and new formats, so it should support both 2.7 forward, as well as previous versions.

## 3.1.0

### Minor Changes

- [#517](https://github.com/seek-oss/vanilla-extract/pull/517) [`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69) Thanks [@benjervis](https://github.com/benjervis)! - Add postcss processing to the plugin

  Vite supports postcss processing as a built in feature, but that's lost in dev mode with vanilla-extract because there are no actual css files for vite to pick up.

  The vite plugin now manually runs postcss over the generated css in serve mode, if any postcss config was found.

### Patch Changes

- Updated dependencies [[`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69)]:
  - @vanilla-extract/integration@2.0.0

## 3.0.1

### Patch Changes

- [#470](https://github.com/seek-oss/vanilla-extract/pull/470) [`a6383e8`](https://github.com/seek-oss/vanilla-extract/commit/a6383e86218a49b5dd9fa471e0776f8cb50c9d7f) Thanks [@Katarina-UBCO](https://github.com/Katarina-UBCO)! - Prefix `.vanilla.js` and `.vanilla.css` virtual modules with `virtual:vanilla-extract:`.

## 3.0.0

### Major Changes

- [#422](https://github.com/seek-oss/vanilla-extract/pull/422) [`4e5ba05`](https://github.com/seek-oss/vanilla-extract/commit/4e5ba05549bc0baae8d82b9e9da9e69f032a1191) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove the `devStyleRuntime` option

### Patch Changes

- [#422](https://github.com/seek-oss/vanilla-extract/pull/422) [`4e5ba05`](https://github.com/seek-oss/vanilla-extract/commit/4e5ba05549bc0baae8d82b9e9da9e69f032a1191) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix HMR for pre-existing CSS

  Previously, styles would not hot reload correctly when returning to a previously cached version

## 2.1.3

### Patch Changes

- [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Fix plugin for watch mode.

  The vite plugin previously relied on a one to one matching of resolve to load calls, and would clean up the CSS stored in memory after it was loaded.

  This isn't true in `--watch` mode, as the same file can be loaded on the rebuild without having to be resolved, which the plugin now handles.

* [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Update the "vanilla-extract" devStyleRuntime option.

  When using the vanilla browser runtime in vite, it now operates on a new model where a .css.js file is generated, that uses @vanilla-extract/css/injectStyles to add the css to the browser.

  This allows for hot reloading of styles, and makes styles a bit easier to debug at dev time (because they're actually visible).

- [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Handle vite 2.6.

  As of vite 2.6 and greater, `?used` gets appended to css imports, which causes the file imports to be not what we expected.

  This caused mismatching classnames in the vite plugin, and it caused the babel plugin to not add filescopes when it should have.

* [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Automatically optimize deps.

  When using the new vanilla browser runtime, the new `injectStyles` dependency gets injected at runtime, so vite can't discover it ahead of time and pre-bundle it.

  The plugin will now add the dependency to optimizeDeps if the vanilla runtime is being used so that it's optimized up front.
  It also ensures that some relevant vanilla packages are externalised in SSR mode.

* Updated dependencies [[`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0)]:
  - @vanilla-extract/integration@1.4.3

## 2.1.2

### Patch Changes

- [#398](https://github.com/seek-oss/vanilla-extract/pull/398) [`63f4ed0`](https://github.com/seek-oss/vanilla-extract/commit/63f4ed0e67419df565f3f447cf27cec612afbb8d) Thanks [@benjervis](https://github.com/benjervis)! - Fixes a bug with vite where "?used" is appended to the file path of css files.

  This could cause different class name hashes to be generated between SSR and client builds.
  This was introduced in vite 2.6.0.

## 2.1.1

### Patch Changes

- [#393](https://github.com/seek-oss/vanilla-extract/pull/393) [`2f379f1`](https://github.com/seek-oss/vanilla-extract/commit/2f379f118c2a2fe6dc08a1cc15a395dbc0f17ece) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix compilation errors in Vite 2.6

- Updated dependencies [[`2f379f1`](https://github.com/seek-oss/vanilla-extract/commit/2f379f118c2a2fe6dc08a1cc15a395dbc0f17ece)]:
  - @vanilla-extract/integration@1.4.2

## 2.1.0

### Minor Changes

- [#373](https://github.com/seek-oss/vanilla-extract/pull/373) [`a55d2cf`](https://github.com/seek-oss/vanilla-extract/commit/a55d2cfd7c4ca9175a2c86557888df90907bfd0f) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `devStyleRuntime` option to allow switching between dev style runtimes

  The built-in Vite dev style runtime (what adds styles to the page when running `vite serve`) doesn't seem to clean up old styles as expected. Passing `devStyleRuntime: 'vanilla-extract'` will instead use vanilla-extract's browser runtime. This pushes all style creation in development to the browser, but may give a better HMR experience.

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
