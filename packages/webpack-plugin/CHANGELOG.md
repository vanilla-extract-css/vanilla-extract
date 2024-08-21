# @vanilla-extract/webpack-plugin

## 2.3.13

### Patch Changes

- Updated dependencies [[`96dd466127374b21ad7e48e5dd168a03a96af047`](https://github.com/vanilla-extract-css/vanilla-extract/commit/96dd466127374b21ad7e48e5dd168a03a96af047)]:
  - @vanilla-extract/integration@7.1.9

## 2.3.12

### Patch Changes

- Updated dependencies [[`6668e9e069276b0fd9ccd9668403b4eeb840a11b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/6668e9e069276b0fd9ccd9668403b4eeb840a11b), [`61878f5fb21a33190ef242551c639e216ba4748a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/61878f5fb21a33190ef242551c639e216ba4748a)]:
  - @vanilla-extract/integration@7.1.8

## 2.3.11

### Patch Changes

- Updated dependencies [[`124c31c2d9fee24d937c4626cec524d527d4e55e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/124c31c2d9fee24d937c4626cec524d527d4e55e)]:
  - @vanilla-extract/integration@7.1.7

## 2.3.10

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@7.1.6

## 2.3.9

### Patch Changes

- [#1335](https://github.com/vanilla-extract-css/vanilla-extract/pull/1335) [`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17) Thanks [@askoufis](https://github.com/askoufis)! - Add `types` field to `package.json`

- Updated dependencies [[`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17)]:
  - @vanilla-extract/integration@7.1.5

## 2.3.8

### Patch Changes

- [#1385](https://github.com/vanilla-extract-css/vanilla-extract/pull/1385) [`3df9b4ebc5ad7e03e5c908c10216447b7089132a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3df9b4ebc5ad7e03e5c908c10216447b7089132a) Thanks [@askoufis](https://github.com/askoufis)! - Replace `chalk` dependency with `picocolors`

- Updated dependencies [[`606660618dc5efa6c529f77cebf9d2b8dc379dbd`](https://github.com/vanilla-extract-css/vanilla-extract/commit/606660618dc5efa6c529f77cebf9d2b8dc379dbd), [`e58cf9013c6f6cdfacb2a7936b3354e71138e9fb`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e58cf9013c6f6cdfacb2a7936b3354e71138e9fb)]:
  - @vanilla-extract/integration@7.1.3

## 2.3.7

### Patch Changes

- [#1333](https://github.com/vanilla-extract-css/vanilla-extract/pull/1333) [`6ac9f66`](https://github.com/vanilla-extract-css/vanilla-extract/commit/6ac9f667cdfde0050e40cf5eaf8ae03078f5d26d) Thanks [@askoufis](https://github.com/askoufis)! - Use a more accurate regex for detecting [webpack template strings] in paths

  We now use a modified version of the regex from the webpack source code to detect template strings in paths.
  As long as the path isn't already escaped, we should detect it.

  [webpack template strings]: https://webpack.js.org/configuration/output/#template-strings

## 2.3.6

### Patch Changes

- Updated dependencies [[`fdafb6d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/fdafb6dff4d3e4455a1a2f5e48e446e11add2c14)]:
  - @vanilla-extract/integration@7.0.0

## 2.3.5

### Patch Changes

- [#1247](https://github.com/vanilla-extract-css/vanilla-extract/pull/1247) [`f0c3be9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f0c3be99ca437fb1f61ecde58fdf58cccc3256bb) Thanks [@askoufis](https://github.com/askoufis)! - Fixes a bug that was causing style compilation to fail on paths containing [webpack template strings] such as `[id]` or [Next.js dynamic routes] such as `[slug]`.

  [webpack template strings]: https://webpack.js.org/configuration/output/#template-strings
  [next.js dynamic routes]: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

- Updated dependencies [[`545bf82`](https://github.com/vanilla-extract-css/vanilla-extract/commit/545bf82f127598ac72265164c72e1a1aad558491)]:
  - @vanilla-extract/integration@6.5.0

## 2.3.4

### Patch Changes

- [#1264](https://github.com/vanilla-extract-css/vanilla-extract/pull/1264) [`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a) Thanks [@mrm007](https://github.com/mrm007)! - Update dependencies

- Updated dependencies [[`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a), [`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a)]:
  - @vanilla-extract/integration@6.4.0

## 2.3.3

### Patch Changes

- [#1291](https://github.com/vanilla-extract-css/vanilla-extract/pull/1291) [`00af971`](https://github.com/vanilla-extract-css/vanilla-extract/commit/00af9715e522d9caf6e90cb138dee13580b8dea1) Thanks [@mrm007](https://github.com/mrm007)! - Update dependency `@vanilla-extract/integration`

- [#1254](https://github.com/vanilla-extract-css/vanilla-extract/pull/1254) [`f373d7f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f373d7f6b59f43236dc713e1b421ef4631f392c0) Thanks [@EvgenNoskov](https://github.com/EvgenNoskov)! - Allow hyphens in class names when using a custom identifier

## 2.3.2

### Patch Changes

- [#1262](https://github.com/vanilla-extract-css/vanilla-extract/pull/1262) [`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e) Thanks [@mrm007](https://github.com/mrm007)! - Update Babel config to target Node.js 14

- Updated dependencies [[`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e), [`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e)]:
  - @vanilla-extract/integration@6.2.5

## 2.3.1

### Patch Changes

- [#1180](https://github.com/vanilla-extract-css/vanilla-extract/pull/1180) [`89224fe`](https://github.com/vanilla-extract-css/vanilla-extract/commit/89224fe9d68d984f818ec3d4496952e4e919a241) Thanks [@syfxlin](https://github.com/syfxlin)! - Fixes Next.js 13 CSS output on Windows when using React Server Components

## 2.3.0

### Minor Changes

- [#1160](https://github.com/vanilla-extract-css/vanilla-extract/pull/1160) [`e391bae`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e391baec32463c60503f631ace578a71952f8180) Thanks [@SombreroElGringo](https://github.com/SombreroElGringo)! - Users can now provide a custom identifier hashing function

## 2.2.0

### Minor Changes

- [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove requirement for `@vanilla-extract/babel-plugin`

  Previously, to get automatic debug IDs you needed to use Babel with the `@vanilla-extract/babel-plugin` in your config. As this is no longer the case, the `@vanilla-extract/babel-plugin` should be removed completely from your project.

### Patch Changes

- Updated dependencies [[`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0), [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0), [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0)]:
  - @vanilla-extract/integration@6.0.0

## 2.1.12

### Patch Changes

- [#783](https://github.com/vanilla-extract-css/vanilla-extract/pull/783) [`21afc23`](https://github.com/vanilla-extract-css/vanilla-extract/commit/21afc23ae552b8071fbe5d7b0c3dce07fc016ee7) Thanks [@benjervis](https://github.com/benjervis)! - Remove the `extracted` entrypoint from the webpack plugin.

## 2.1.11

### Patch Changes

- Updated dependencies [[`e373b51`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e373b51bfa8401e0746596adafbda350c9fad4c3)]:
  - @vanilla-extract/integration@5.0.0

## 2.1.10

### Patch Changes

- [#673](https://github.com/vanilla-extract-css/vanilla-extract/pull/673) [`f6d5337`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where `.css.ts` files with the same file path from other packages could have identifier collisions

- Updated dependencies [[`f6d5337`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140)]:
  - @vanilla-extract/integration@4.0.1

## 2.1.9

### Patch Changes

- [#647](https://github.com/vanilla-extract-css/vanilla-extract/pull/647) [`3c9b7d9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Use more realistic file paths for virtual CSS files

- Updated dependencies [[`3c9b7d9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636)]:
  - @vanilla-extract/integration@4.0.0

## 2.1.8

### Patch Changes

- [#634](https://github.com/vanilla-extract-css/vanilla-extract/pull/634) [`69b8460`](https://github.com/vanilla-extract-css/vanilla-extract/commit/69b846015ecada3354ea292e1276e5da560923c6) Thanks [@phil-lgr](https://github.com/phil-lgr)! - Add fileName to the CSS virtual loader params

  This allows users to identify the source file for vanilla-extract css imports

## 2.1.7

### Patch Changes

- [#645](https://github.com/vanilla-extract-css/vanilla-extract/pull/645) [`5ebca75`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5ebca758d18e7d55d0c079c00178cb14e936ac2e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Bump `@vanilla-extract/integration` dep

## 2.1.6

### Patch Changes

- [#621](https://github.com/vanilla-extract-css/vanilla-extract/pull/621) [`bec1cd8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9) Thanks [@nayaabkhan](https://github.com/nayaabkhan)! - Improve build performance when creating large CSS files

- Updated dependencies [[`bec1cd8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bec1cd88d78071a995edc76a5c626f361fafcda9), [`e1550da`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4), [`e1550da`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1550dac59011c8161317f5f0b792a0dd520bbd4)]:
  - @vanilla-extract/integration@3.0.0

## 2.1.5

### Patch Changes

- [#543](https://github.com/vanilla-extract-css/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/integration@2.0.1

## 2.1.4

### Patch Changes

- Updated dependencies [[`64791f3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/64791f39c7090eeb301796b15218f51d43532e69)]:
  - @vanilla-extract/integration@2.0.0

## 2.1.3

### Patch Changes

- [#508](https://github.com/vanilla-extract-css/vanilla-extract/pull/508) [`d15e783`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 2.1.2

### Patch Changes

- [#492](https://github.com/vanilla-extract-css/vanilla-extract/pull/492) [`f2d2d9e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f2d2d9eea18dcd4ffec694f8056a78d850485592) Thanks [@benjervis](https://github.com/benjervis)! - Fix requiring of webpack loader

  Previously, the webpack plugin would reference itself as a loader by requiring `@vanilla-extract/webpack-plugin/loader`, but this was technically incorrect, and only worked because of the flat node_modules structure that yarn provides.

  When using a package manager like pnpm, which does not have a flat structure, this breaks.

  This change uses relative references internally to ensure that the loader can always be required.

## 2.1.1

### Patch Changes

- [#459](https://github.com/vanilla-extract-css/vanilla-extract/pull/459) [`2719dc0`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2719dc0b75172bb43648ddf2a3f2f31f58e42426) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove unused files and dependencies

* [#459](https://github.com/vanilla-extract-css/vanilla-extract/pull/459) [`2719dc0`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2719dc0b75172bb43648ddf2a3f2f31f58e42426) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove "Styles detected outside of '.css.(ts/js)' files" error

  This error could occasionally cause false positives, and was inconsistent with the rest of the integrations.

## 2.1.0

### Minor Changes

- [#341](https://github.com/vanilla-extract-css/vanilla-extract/pull/341) [`0b743e7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - No longer require Babel to be run on .css.ts files

  Previously, the `@vanilla-extract/webpack-plugin` required the `@vanilla-extract/babel-plugin` to be run over .css.ts files. In order to bring webpack inline with the other integrations, the `@vanilla-extract/webpack-plugin` can now be used without Babel.

  Note: Automatic debug IDs still require the `@vanilla-extract/babel-plugin`.

### Patch Changes

- Updated dependencies [[`50bae14`](https://github.com/vanilla-extract-css/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772), [`0b743e7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0b743e744447616f8daf0c6b88beff8ffef8d41b)]:
  - @vanilla-extract/integration@1.3.0

## 2.0.0

### Major Changes

- [#323](https://github.com/vanilla-extract-css/vanilla-extract/pull/323) [`1e7d647`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Formatting of identifiers (e.g. class names, keyframes, CSS Vars, etc) can now be configured via the `identifiers` option which accepts either `short` or `debug`.

  - `short` identifiers are a 7+ character hash. e.g. `hnw5tz3`
  - `debug` identifiers contain human readable prefixes representing the owning filename and a potential rule level debug name. e.g. `somefile_mystyle_hnw5tz3`

  ```js
  import { vanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';

  vanillaExtractPlugin({ identifiers: 'short' });
  ```

  BREAKING CHANGE

  Previously identifiers were formatted as `short` when `process.env.NODE_ENV` was set to "production". By default, they will now be formatted according to webpack's [mode config](https://webpack.js.org/configuration/mode/).

### Patch Changes

- Updated dependencies [[`1e7d647`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275)]:
  - @vanilla-extract/integration@1.2.0

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

- [#260](https://github.com/vanilla-extract-css/vanilla-extract/pull/260) [`c3d9d78`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c3d9d7843cc9cf1d326c8f3ae1d2bd1294cf1b0c) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove unused compiler cache

- Updated dependencies [[`b8a6441`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a6441e3400be388a520e3acf94f3bb6519cf0a)]:
  - @vanilla-extract/integration@1.1.0

## 1.0.3

### Patch Changes

- [#208](https://github.com/vanilla-extract-css/vanilla-extract/pull/208) [`a1c79fc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a1c79fc10c5cf7f30dce0269f9183dfd4f2456e9) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Deprecate redundant `allowRuntime` option

## 1.0.2

### Patch Changes

- [#195](https://github.com/vanilla-extract-css/vanilla-extract/pull/195) [`1099b34`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1099b34437757522799c26bec7471df209ef9b36) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue when @vanilla-extract/webpack-plugin is nested within a separate node_modules folder

## 1.0.1

### Patch Changes

- [#181](https://github.com/vanilla-extract-css/vanilla-extract/pull/181) [`7a63af8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/7a63af8212edfb842261db4d1cca88cce8612764) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where CSS can be duplicated in some scenarios

## 1.0.0

### Major Changes

- [#171](https://github.com/vanilla-extract-css/vanilla-extract/pull/171) [`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/integration@1.0.0

## 0.3.1

### Patch Changes

- [#134](https://github.com/vanilla-extract-css/vanilla-extract/pull/134) [`b99dd0a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b99dd0a2d6ce171b4776aa11d0ab2c7e1559ddae) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Move shared logic to integration package

## 0.3.0

### Minor Changes

- [#53](https://github.com/vanilla-extract-css/vanilla-extract/pull/53) [`58e4f8a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/58e4f8aa6a2c56c5f26408539756529705a598b8) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support exporting functions from `.css.ts` files via recipes

### Patch Changes

- Updated dependencies [[`48c4a78`](https://github.com/vanilla-extract-css/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656), [`2d98bcc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d)]:
  - @vanilla-extract/css@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [[`156b491`](https://github.com/vanilla-extract-css/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a), [`ae9864c`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6), [`756d9b0`](https://github.com/vanilla-extract-css/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b)]:
  - @vanilla-extract/css@0.3.0

## 0.2.0

### Minor Changes

- [#20](https://github.com/vanilla-extract-css/vanilla-extract/pull/20) [`3311914`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

### Patch Changes

- Updated dependencies [[`3311914`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5), [`c4bedd5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460)]:
  - @vanilla-extract/css@0.2.0

## 0.1.0

### Minor Changes

- e83ad50: Initial release

### Patch Changes

- Updated dependencies [e83ad50]
  - @vanilla-extract/css@0.1.0
