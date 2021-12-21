# @vanilla-extract/integration

## 2.0.0

### Major Changes

- [#517](https://github.com/seek-oss/vanilla-extract/pull/517) [`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69) Thanks [@benjervis](https://github.com/benjervis)! - processVanillaFile is now async

### Patch Changes

- Updated dependencies [[`b294764`](https://github.com/seek-oss/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d)]:
  - @vanilla-extract/css@1.6.8

## 1.4.3

### Patch Changes

- [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Export the fileScope functions.

  `stringifyFileScope` and `parseFileScope` are now exported to be used in other packages.

- Updated dependencies [[`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0)]:
  - @vanilla-extract/css@1.6.2

## 1.4.2

### Patch Changes

- [#393](https://github.com/seek-oss/vanilla-extract/pull/393) [`2f379f1`](https://github.com/seek-oss/vanilla-extract/commit/2f379f118c2a2fe6dc08a1cc15a395dbc0f17ece) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix compilation errors in Vite 2.6

## 1.4.1

### Patch Changes

- [#389](https://github.com/seek-oss/vanilla-extract/pull/389) [`23d2757`](https://github.com/seek-oss/vanilla-extract/commit/23d275794d38f01049b824e3e000fb1bb2411717) Thanks [@aulneau](https://github.com/aulneau)! - This update adds `mjs` to the file `*.css.*` regex, enabling better support for ESM packages/files.

## 1.4.0

### Minor Changes

- [#348](https://github.com/seek-oss/vanilla-extract/pull/348) [`c6cd1f2`](https://github.com/seek-oss/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFunctionSerializer` function

  This also marks `addRecipe` as deprecated.

### Patch Changes

- Updated dependencies [[`c6cd1f2`](https://github.com/seek-oss/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42)]:
  - @vanilla-extract/css@1.5.0

## 1.3.0

### Minor Changes

- [#341](https://github.com/seek-oss/vanilla-extract/pull/341) [`0b743e7`](https://github.com/seek-oss/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFileScope` API

### Patch Changes

- [#343](https://github.com/seek-oss/vanilla-extract/pull/343) [`50bae14`](https://github.com/seek-oss/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Cleanup adapter after processing styles

- Updated dependencies [[`50bae14`](https://github.com/seek-oss/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772)]:
  - @vanilla-extract/css@1.4.1

## 1.2.0

### Minor Changes

- [#323](https://github.com/seek-oss/vanilla-extract/pull/323) [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support configurable identifier types

### Patch Changes

- Updated dependencies [[`26832f1`](https://github.com/seek-oss/vanilla-extract/commit/26832f162e75b72f83dba0c230295a5dfed683aa), [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/css@1.3.0

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
  - @vanilla-extract/css@1.2.0

## 1.0.1

### Patch Changes

- [#176](https://github.com/seek-oss/vanilla-extract/pull/176) [`cbfe0de`](https://github.com/seek-oss/vanilla-extract/commit/cbfe0def098dcf820fb710388cdc82b48436bdca) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Continue searching for package.json if one is found with no name

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/css@1.0.0

## 0.1.4

### Patch Changes

- [#110](https://github.com/seek-oss/vanilla-extract/pull/110) [`e41529e`](https://github.com/seek-oss/vanilla-extract/commit/e41529e50efe22e1429e3b60f6df83e299dea6c0) Thanks [@mxmul](https://github.com/mxmul)! - Add `fileScope` to `serializeVirtualCssPath` option

## 0.1.3

### Patch Changes

- [#136](https://github.com/seek-oss/vanilla-extract/pull/136) [`2247cdc`](https://github.com/seek-oss/vanilla-extract/commit/2247cdc55c04cdaa54cce1f69361da9617179a6b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix serialization of booleans

## 0.1.2

### Patch Changes

- [#133](https://github.com/seek-oss/vanilla-extract/pull/133) [`a50de75`](https://github.com/seek-oss/vanilla-extract/commit/a50de7505849a317d76713d225514050a38e23e2) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve Windows support

  Normalize all file paths to POSIX format. This fixes incorrect file paths on Windows and ensures consistent hashes across all operating systems.

- Updated dependencies [[`ed76e45`](https://github.com/seek-oss/vanilla-extract/commit/ed76e450038cb7cbaf12a511fda9e2a3a6d21b96), [`4f92126`](https://github.com/seek-oss/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166)]:
  - @vanilla-extract/css@0.5.0

## 0.1.1

### Patch Changes

- [#126](https://github.com/seek-oss/vanilla-extract/pull/126) [`400ece7`](https://github.com/seek-oss/vanilla-extract/commit/400ece75e1d2b385c2b76a80e8a6872710d3e2f9) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Normalize virtual CSS file paths for Windows
