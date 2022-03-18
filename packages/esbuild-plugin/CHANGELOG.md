# @vanilla-extract/esbuild-plugin

## 2.0.3

### Patch Changes

- [#621](https://github.com/seek-oss/vanilla-extract/pull/621) [`bec1cd8`](https://github.com/seek-oss/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9) Thanks [@nayaabkhan](https://github.com/nayaabkhan)! - Improve build performance when creating large CSS files

- Updated dependencies [[`bec1cd8`](https://github.com/seek-oss/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4), [`e1550da`](https://github.com/seek-oss/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4)]:
  - @vanilla-extract/integration@3.0.0

## 2.0.2

### Patch Changes

- [#543](https://github.com/seek-oss/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/seek-oss/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/integration@2.0.1

## 2.0.1

### Patch Changes

- Updated dependencies [[`64791f3`](https://github.com/seek-oss/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69)]:
  - @vanilla-extract/integration@2.0.0

## 2.0.0

### Major Changes

- [#323](https://github.com/seek-oss/vanilla-extract/pull/323) [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can now be configured via the `identifiers` option which accepts either `short` or `debug`.

  - `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
  - `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `somefile_mystyle_hnw5tz3`

  ```js
  import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin';

  vanillaExtractPlugin({ identifiers: 'short' });
  ```

  BREAKING CHANGE

  Previously identifiers were formatted as `short` when `process.env.NODE_ENV` was set to "production". By default, they will now be formatted according to esbuild's [minify config](https://esbuild.github.io/api/#minify).

### Patch Changes

- Updated dependencies [[`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/integration@1.2.0

## 1.2.0

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

## 1.1.0

### Minor Changes

- [#183](https://github.com/seek-oss/vanilla-extract/pull/183) [`6721228`](https://github.com/seek-oss/vanilla-extract/commit/672122828f763193c9086706ba969caa6c564761) Thanks [@Brendan-csel](https://github.com/Brendan-csel)! - Add `processCss` plugin option to allow further processing of CSS while bundling.

  **Example for postcss with autoprefixer:**

  ```js
  const { vanillaExtractPlugin } = require('@vanilla-extract/esbuild-plugin');
  const postcss = require('postcss');
  const autoprefixer = require('autoprefixer');

  async function processCss(css) {
    const result = await postcss([autoprefixer]).process(css, {
      from: undefined /* suppress source map warning */,
    });

    return result.css;
  }

  require('esbuild')
    .build({
      entryPoints: ['app.ts'],
      bundle: true,
      plugins: [
        vanillaExtractPlugin({
          processCss,
        }),
      ],
      outfile: 'out.js',
    })
    .catch(() => process.exit(1));
  ```

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
