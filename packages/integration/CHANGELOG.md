# @vanilla-extract/integration

## 6.2.4

### Patch Changes

- [#1238](https://github.com/vanilla-extract-css/vanilla-extract/pull/1238) [`fd5d9fc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/fd5d9fc389b84d7de92ec86d89305185d6c4cfd4) Thanks [@askoufis](https://github.com/askoufis)! - Disable config file resolution in experimental `vite-node` compiler

## 6.2.3

### Patch Changes

- [#1195](https://github.com/vanilla-extract-css/vanilla-extract/pull/1195) [`c446b5e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c446b5e95ee4e64f7af0da484d2dda81a7f6a522) Thanks [@HelloWorld017](https://github.com/HelloWorld017)! - Ensure userland babel config can not affect integration transforms

- Updated dependencies [[`906d288`](https://github.com/vanilla-extract-css/vanilla-extract/commit/906d28881d2c3cc1f5a49f00b8b697df66a5baa4), [`911c8b7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/911c8b7b95b1164d2ad5fbf555209df9e8b3ad99)]:
  - @vanilla-extract/css@1.14.0

## 6.2.2

### Patch Changes

- [#1167](https://github.com/vanilla-extract-css/vanilla-extract/pull/1167) [`53fd2a6`](https://github.com/vanilla-extract-css/vanilla-extract/commit/53fd2a6a3387a47745387f792d723deaf37d84a2) Thanks [@askoufis](https://github.com/askoufis)! - Bump `eval` to `0.1.8`

## 6.2.1

### Patch Changes

- [#1036](https://github.com/vanilla-extract-css/vanilla-extract/pull/1036) [`7e876b6`](https://github.com/vanilla-extract-css/vanilla-extract/commit/7e876b6f114e700c91734d79579863b83147231e) Thanks [@askoufis](https://github.com/askoufis)! - Sort serialized module exports

  Fixes a Vanilla module serialization bug that sometimes resulted in variables being used before they were declared

## 6.2.0

### Minor Changes

- [#1030](https://github.com/vanilla-extract-css/vanilla-extract/pull/1030) [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `createCompiler` function for creating a compiler instance that can be re-used between builds. This is a low-level function intended for use by bundler plugins and, as such, is currently undocumented. Note that in order to use the new compiler you must also update `@vanilla-extract/css` to v1.10.0.

* [#1030](https://github.com/vanilla-extract-css/vanilla-extract/pull/1030) [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add support for `onBeginFileScope` adapter lifecycle hook

### Patch Changes

- [#1024](https://github.com/vanilla-extract-css/vanilla-extract/pull/1024) [`45d3b86`](https://github.com/vanilla-extract-css/vanilla-extract/commit/45d3b86960027cdfa81989f8e2036a6768cc1e1d) Thanks [@huw](https://github.com/huw)! - Don’t throw when failing to add debug objects to an empty file

* [#1030](https://github.com/vanilla-extract-css/vanilla-extract/pull/1030) [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Bump esbuild to v0.17.6

* Updated dependencies [[`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d), [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d)]:
  - @vanilla-extract/css@1.10.0

## 6.1.2

### Patch Changes

- [#1031](https://github.com/vanilla-extract-css/vanilla-extract/pull/1031) [`316658f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/316658fc29341286fc14287eeeed44a36545b0c7) Thanks [@mrm007](https://github.com/mrm007)! - Add `.css.cjs` extension to the Vanilla Extract file filter

## 6.1.1

### Patch Changes

- [#996](https://github.com/vanilla-extract-css/vanilla-extract/pull/996) [`bd6ed30`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bd6ed30e0301d77ab21152e6d4a708e8ff491b74) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve Vanilla module serialization by allowing shared variables between exports

- Updated dependencies [[`8a1751c`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8a1751c8fcbeaa0cfb8d894a8050535372516dd4)]:
  - @vanilla-extract/babel-plugin-debug-ids@1.0.2

## 6.1.0

### Minor Changes

- [#926](https://github.com/vanilla-extract-css/vanilla-extract/pull/926) [`7074969`](https://github.com/vanilla-extract-css/vanilla-extract/commit/70749697eb281086913ba7a2ec170a375832ed1c) Thanks [@ericmatthys](https://github.com/ericmatthys)! - Allow tsconfig option to be passed through to esbuild

### Patch Changes

- Updated dependencies [[`d02684e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d02684e1bf0e8b4f51ab2a273233ada9df57ebc9)]:
  - @vanilla-extract/css@1.9.4

## 6.0.3

### Patch Changes

- [#970](https://github.com/vanilla-extract-css/vanilla-extract/pull/970) [`16b9a71`](https://github.com/vanilla-extract-css/vanilla-extract/commit/16b9a71e57cd2accf7a58d2bc92dd03cd33813b6) Thanks [@roginfarrer](https://github.com/roginfarrer)! - Updated addFileScope to work with CommonJS files

## 6.0.2

### Patch Changes

- [#956](https://github.com/vanilla-extract-css/vanilla-extract/pull/956) [`eea3c7d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/eea3c7d1595cd881e68cfbb279c641dc2fdd9101) Thanks [@mrm007](https://github.com/mrm007)! - Ensure support for new TypeScript language features by bumping the minimum required Babel dependency versions.

* [#973](https://github.com/vanilla-extract-css/vanilla-extract/pull/973) [`cc60aa8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/cc60aa81bbb51e5b6bd3d0241ad68f3deb3b1b9a) Thanks [@cliffordfajardo](https://github.com/cliffordfajardo)! - Upgrade esbuild `^0.11.16` to `^0.16.3`

* Updated dependencies [[`eea3c7d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/eea3c7d1595cd881e68cfbb279c641dc2fdd9101), [`4ecdcd7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4ecdcd727302a51d2428031e96bd48011d387c8b)]:
  - @vanilla-extract/babel-plugin-debug-ids@1.0.1
  - @vanilla-extract/css@1.9.3

## 6.0.1

### Patch Changes

- [#869](https://github.com/vanilla-extract-css/vanilla-extract/pull/869) [`2d08761`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2d08761598668c0e7066837ccb0be7b4d5637701) Thanks [@mrm007](https://github.com/mrm007)! - Use correct async Babel transform method in integration transform

- Updated dependencies [[`176c026`](https://github.com/vanilla-extract-css/vanilla-extract/commit/176c026fd72bda3fc969ba0d91494540f88488cb), [`98f8b03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/98f8b0387d661b77705d2cd83ab3095434e1223e), [`8ed77c2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8ed77c23ac004cd6e66b27f36100d5d5d014bc39)]:
  - @vanilla-extract/css@1.9.2

## 6.0.0

### Major Changes

- [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - `vanillaExtractFilescopePlugin` has been renamed to `vanillaExtractTransformPlugin`

* [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - `compile` now expects a valid `identOption` parameter

### Minor Changes

- [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `transform` and `transformSync` functions

  The transform APIs can be used to append filescopes and automatic debug IDs to `.css.ts` files.

## 5.0.1

### Patch Changes

- [#801](https://github.com/vanilla-extract-css/vanilla-extract/pull/801) [`bb48520`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bb485203f85e01272e44fc26df78581f3b8b4da0) Thanks [@mrm007](https://github.com/mrm007)! - Omit [`Symbol.toStringTag`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) when serializing module exports.

## 5.0.0

### Major Changes

- [#668](https://github.com/vanilla-extract-css/vanilla-extract/pull/668) [`e373b51`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e373b51bfa8401e0746596adafbda350c9fad4c3) Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)! - Add esbuild configurations to vite/esbuild/rollup plugins

### Patch Changes

- Updated dependencies [[`8467fc2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8467fc28707372f30d8b6239580244c06859a605)]:
  - @vanilla-extract/css@1.7.2

## 4.0.1

### Patch Changes

- [#673](https://github.com/vanilla-extract-css/vanilla-extract/pull/673) [`f6d5337`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where `.css.ts` files with the same file path from other packages could have identifier collisions

## 4.0.0

### Major Changes

- [#647](https://github.com/vanilla-extract-css/vanilla-extract/pull/647) [`3c9b7d9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Update `addFileScope` to always update and only use file names

## 3.0.1

### Patch Changes

- [#639](https://github.com/vanilla-extract-css/vanilla-extract/pull/639) [`7b9ddfc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/7b9ddfc30dacc66db11253f9d1862e7ba46b88ec) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Fix "\_\_webpack_require\_\_ is not defined" error

## 3.0.0

### Major Changes

- [#623](https://github.com/vanilla-extract-css/vanilla-extract/pull/623) [`e1550da`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - BREAKING CHANGE

  `getSourceFromVirtualCssFile` is now async.

* [#623](https://github.com/vanilla-extract-css/vanilla-extract/pull/623) [`e1550da`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `serializeCss` and `deserializeCss` utilities.

  BREAKING CHANGE

  Remove `base64Source` from `serializeVirtualCssPath`. Use the new `serializeCss` and `deserializeCss` functions if required.

### Patch Changes

- [#621](https://github.com/vanilla-extract-css/vanilla-extract/pull/621) [`bec1cd8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9) Thanks [@nayaabkhan](https://github.com/nayaabkhan)! - Improve build performance when creating large CSS files

## 2.0.2

### Patch Changes

- [#609](https://github.com/vanilla-extract-css/vanilla-extract/pull/609) [`02f2a23`](https://github.com/vanilla-extract-css/vanilla-extract/commit/02f2a236ac0b9ce1feeac4f840eb0759e8ca1b6f) Thanks [@xnuk](https://github.com/xnuk)! - Remove unused `chalk` dep

## 2.0.1

### Patch Changes

- [#543](https://github.com/vanilla-extract-css/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

## 2.0.0

### Major Changes

- [#517](https://github.com/vanilla-extract-css/vanilla-extract/pull/517) [`64791f3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69) Thanks [@benjervis](https://github.com/benjervis)! - processVanillaFile is now async

### Patch Changes

- Updated dependencies [[`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d)]:
  - @vanilla-extract/css@1.6.8

## 1.4.3

### Patch Changes

- [#409](https://github.com/vanilla-extract-css/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Export the fileScope functions.

  `stringifyFileScope` and `parseFileScope` are now exported to be used in other packages.

- Updated dependencies [[`a9c5cb7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0)]:
  - @vanilla-extract/css@1.6.2

## 1.4.2

### Patch Changes

- [#393](https://github.com/vanilla-extract-css/vanilla-extract/pull/393) [`2f379f1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2f379f118c2a2fe6dc08a1cc15a395dbc0f17ece) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix compilation errors in Vite 2.6

## 1.4.1

### Patch Changes

- [#389](https://github.com/vanilla-extract-css/vanilla-extract/pull/389) [`23d2757`](https://github.com/vanilla-extract-css/vanilla-extract/commit/23d275794d38f01049b824e3e000fb1bb2411717) Thanks [@aulneau](https://github.com/aulneau)! - This update adds `mjs` to the file `*.css.*` regex, enabling better support for ESM packages/files.

## 1.4.0

### Minor Changes

- [#348](https://github.com/vanilla-extract-css/vanilla-extract/pull/348) [`c6cd1f2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFunctionSerializer` function

  This also marks `addRecipe` as deprecated.

### Patch Changes

- Updated dependencies [[`c6cd1f2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42)]:
  - @vanilla-extract/css@1.5.0

## 1.3.0

### Minor Changes

- [#341](https://github.com/vanilla-extract-css/vanilla-extract/pull/341) [`0b743e7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFileScope` API

### Patch Changes

- [#343](https://github.com/vanilla-extract-css/vanilla-extract/pull/343) [`50bae14`](https://github.com/vanilla-extract-css/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Cleanup adapter after processing styles

- Updated dependencies [[`50bae14`](https://github.com/vanilla-extract-css/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772)]:
  - @vanilla-extract/css@1.4.1

## 1.2.0

### Minor Changes

- [#323](https://github.com/vanilla-extract-css/vanilla-extract/pull/323) [`1e7d647`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support configurable identifier types

### Patch Changes

- Updated dependencies [[`26832f1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/26832f162e75b72f83dba0c230295a5dfed683aa), [`1e7d647`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/css@1.3.0

## 1.1.0

### Minor Changes

- [#259](https://github.com/vanilla-extract-css/vanilla-extract/pull/259) [`b8a6441`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Allow the result of `composeStyles` to be used in selectors

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

- Updated dependencies [[`b8a6441`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a)]:
  - @vanilla-extract/css@1.2.0

## 1.0.1

### Patch Changes

- [#176](https://github.com/vanilla-extract-css/vanilla-extract/pull/176) [`cbfe0de`](https://github.com/vanilla-extract-css/vanilla-extract/commit/cbfe0def098dcf820fb710388cdc82b48436bdca) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Continue searching for package.json if one is found with no name

## 1.0.0

### Major Changes

- [#171](https://github.com/vanilla-extract-css/vanilla-extract/pull/171) [`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/css@1.0.0

## 0.1.4

### Patch Changes

- [#110](https://github.com/vanilla-extract-css/vanilla-extract/pull/110) [`e41529e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e41529e50efe22e1429e3b60f6df83e299dea6c0) Thanks [@mxmul](https://github.com/mxmul)! - Add `fileScope` to `serializeVirtualCssPath` option

## 0.1.3

### Patch Changes

- [#136](https://github.com/vanilla-extract-css/vanilla-extract/pull/136) [`2247cdc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2247cdc55c04cdaa54cce1f69361da9617179a6b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix serialization of booleans

## 0.1.2

### Patch Changes

- [#133](https://github.com/vanilla-extract-css/vanilla-extract/pull/133) [`a50de75`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a50de7505849a317d76713d225514050a38e23e2) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve Windows support

  Normalize all file paths to POSIX format. This fixes incorrect file paths on Windows and ensures consistent hashes across all operating systems.

- Updated dependencies [[`ed76e45`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ed76e450038cb7cbaf12a511fda9e2a3a6d21b96), [`4f92126`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166)]:
  - @vanilla-extract/css@0.5.0

## 0.1.1

### Patch Changes

- [#126](https://github.com/vanilla-extract-css/vanilla-extract/pull/126) [`400ece7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/400ece75e1d2b385c2b76a80e8a6872710d3e2f9) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Normalize virtual CSS file paths for Windows
