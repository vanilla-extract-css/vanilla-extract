# @vanilla-extract/css

## 1.6.5

### Patch Changes

- [#504](https://github.com/seek-oss/vanilla-extract/pull/504) [`16c960f`](https://github.com/seek-oss/vanilla-extract/commit/16c960f32a011580eb6c4d0a45479fc28729e762) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure identifiers are escaped properly

## 1.6.4

### Patch Changes

- [#489](https://github.com/seek-oss/vanilla-extract/pull/489) [`0c1ec7d`](https://github.com/seek-oss/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix theme contract types in TypeScript 4.5

- Updated dependencies [[`0c1ec7d`](https://github.com/seek-oss/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3)]:
  - @vanilla-extract/private@1.0.2

## 1.6.3

### Patch Changes

- [#428](https://github.com/seek-oss/vanilla-extract/pull/428) [`e915f7f`](https://github.com/seek-oss/vanilla-extract/commit/e915f7f0c1176f8403118d867216cc19490ad13f) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure whitespace is stripped from debug Ids

## 1.6.2

### Patch Changes

- [#409](https://github.com/seek-oss/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/seek-oss/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Improve the browser runtime dev experience.

  The vanilla browser runtime now creates style tags containing the CSS itself, rather than injecting it directly into the CSSOM.

  This helps with debugability, as the generated CSS can actually be seen in the devtools.
  There are also some new attributes set on the style tags, making it easier to identify the source of each style.

## 1.6.1

### Patch Changes

- [#381](https://github.com/seek-oss/vanilla-extract/pull/381) [`b1e5936`](https://github.com/seek-oss/vanilla-extract/commit/b1e5936db253d81cca60c31adeabd2dd0a240389) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix identfiers not respecting `NODE_ENV` for SSR builds

## 1.6.0

### Minor Changes

- [#361](https://github.com/seek-oss/vanilla-extract/pull/361) [`531044b`](https://github.com/seek-oss/vanilla-extract/commit/531044b8c5c2d13c465ed77641d3cc6a11903ced) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Automatically add quotes to `content` values when necessary

  For example `{ content: '' }` will now return CSS of `{ content: "" }`

## 1.5.1

### Patch Changes

- [#354](https://github.com/seek-oss/vanilla-extract/pull/354) [`cdad52d`](https://github.com/seek-oss/vanilla-extract/commit/cdad52d6e95422f4ce53b74456fd510880a4a32a) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix function serialization with older versions of the `@vanilla-extract/integration` package

## 1.5.0

### Minor Changes

- [#348](https://github.com/seek-oss/vanilla-extract/pull/348) [`c6cd1f2`](https://github.com/seek-oss/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFunctionSerializer` function

  This also marks `addRecipe` as deprecated.

## 1.4.1

### Patch Changes

- [#343](https://github.com/seek-oss/vanilla-extract/pull/343) [`50bae14`](https://github.com/seek-oss/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Cleanup adapter after processing styles

## 1.4.0

### Minor Changes

- [#326](https://github.com/seek-oss/vanilla-extract/pull/326) [`2d9b4c3`](https://github.com/seek-oss/vanilla-extract/commit/2d9b4c3e711310e55dbefe4b3430a771d95d62fd) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support passing arrays of styles to `style` and `styleVariants`

  Multiple styles can now be composed into a single rule by providing an array of styles.

  ```ts
  import { style } from '@vanilla-extract/css';

  const base = style({ padding: 12 });

  export const primary = style([base, { background: 'blue' }]);

  export const secondary = style([base, { background: 'aqua' }]);
  ```

  When composed styles are used in selectors, they are assigned an additional class if required so they can be uniquely identified. When selectors are processed internally, the composed classes are removed, only leaving behind the unique identifier classes. This allows you to treat them as if they were a single class within vanilla-extract selectors.

  ```ts
  import { style, globalStyle } from '@vanilla-extract/css';

  const background = style({ background: 'mintcream' });
  const padding = style({ padding: 12 });

  export const container = style([background, padding]);

  globalStyle(`${container} *`, {
    boxSizing: 'border-box',
  });
  ```

  This feature is a replacement for the standalone `composeStyles` function which is now marked as deprecated. You can use `style` with an array as a drop-in replacement.

  ```diff
  -export const container = composeStyles(background, padding);
  +export const container = style([background, padding]);
  ```

## 1.3.0

### Minor Changes

- [#319](https://github.com/seek-oss/vanilla-extract/pull/319) [`26832f1`](https://github.com/seek-oss/vanilla-extract/commit/26832f162e75b72f83dba0c230295a5dfed683aa) Thanks [@nicksrandall](https://github.com/nicksrandall)! - Add `createGlobalThemeContract` function

  Creates a contract of globally scoped variable names for themes to implement.

  > 💡 This is useful if you want to make your theme contract available to non-JavaScript environments.

  ```ts
  // themes.css.ts
  import {
    createGlobalThemeContract,
    createGlobalTheme,
  } from '@vanilla-extract/css';

  export const vars = createGlobalThemeContract({
    color: {
      brand: 'color-brand',
    },
    font: {
      body: 'font-body',
    },
  });

  createGlobalTheme(':root', vars, {
    color: {
      brand: 'blue',
    },
    font: {
      body: 'arial',
    },
  });
  ```

  You can also provide a map function as the second argument which has access to the value and the object path.

  For example, you can automatically prefix all variable names.

  ```ts
  // themes.css.ts
  import { createGlobalThemeContract } from '@vanilla-extract/css';

  export const vars = createGlobalThemeContract(
    {
      color: {
        brand: 'color-brand',
      },
      font: {
        body: 'font-body',
      },
    },
    value => `prefix-${value}`,
  );
  ```

  You can also use the map function to automatically generate names from the object path, joining keys with a hyphen.

  ```ts
  // themes.css.ts
  import { createGlobalThemeContract } from '@vanilla-extract/css';

  export const vars = createGlobalThemeContract(
    {
      color: {
        brand: null,
      },
      font: {
        body: null,
      },
    },
    (_value, path) => `prefix-${path.join('-')}`,
  );
  ```

* [#323](https://github.com/seek-oss/vanilla-extract/pull/323) [`1e7d647`](https://github.com/seek-oss/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support configurable identifier types

## 1.2.3

### Patch Changes

- [#284](https://github.com/seek-oss/vanilla-extract/pull/284) [`e65c029`](https://github.com/seek-oss/vanilla-extract/commit/e65c0297a557f141cf84ca0836ee8ab4060c9d78) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix multiple top-level conditional styles in runtime version

## 1.2.2

### Patch Changes

- [#274](https://github.com/seek-oss/vanilla-extract/pull/274) [`21e2197`](https://github.com/seek-oss/vanilla-extract/commit/21e2197363fdfbf4ba2cec54ab630cd343281816) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix type errors with nested null values in theme contracts

## 1.2.1

### Patch Changes

- [#265](https://github.com/seek-oss/vanilla-extract/pull/265) [`385155f`](https://github.com/seek-oss/vanilla-extract/commit/385155faff4eeab0bba5137383fe948999c04b2c) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix fileScope error if `composeStyles` is called at runtime

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

## 1.1.2

### Patch Changes

- [#238](https://github.com/seek-oss/vanilla-extract/pull/238) [`1ee9ba2`](https://github.com/seek-oss/vanilla-extract/commit/1ee9ba2c5e6598450b8bac10d244b7e375e71617) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow passing of null contract tokens in `createThemeContract`

## 1.1.1

### Patch Changes

- [#235](https://github.com/seek-oss/vanilla-extract/pull/235) [`1e49dfc`](https://github.com/seek-oss/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createGlobalTheme` types when accepting an existing contract

- Updated dependencies [[`1e49dfc`](https://github.com/seek-oss/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e)]:
  - @vanilla-extract/private@1.0.1

## 1.1.0

### Minor Changes

- [#206](https://github.com/seek-oss/vanilla-extract/pull/206) [`64c18f9`](https://github.com/seek-oss/vanilla-extract/commit/64c18f976bdada1f99022e88065a8277d56b5592) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `disableRuntimeStyles` entrypoint

  In testing environments (like `jsdom`) vanilla-extract will create and insert styles. While this is often desirable, it can be a major slowdown in your tests. If your tests don't require styles to be available, the `disableRuntimeStyles` import will disable all style creation.

  ```ts
  // setupTests.ts
  import '@vanilla-extract/css/disableRuntimeStyles';
  ```

## 1.0.1

### Patch Changes

- [#204](https://github.com/seek-oss/vanilla-extract/pull/204) [`16f77ef`](https://github.com/seek-oss/vanilla-extract/commit/16f77efba69a11fb37a43c83af8e39c1534dffea) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Ensure `:where`/`:is` selectors are supported when validating scoped selectors

## 1.0.0

### Major Changes

- [#171](https://github.com/seek-oss/vanilla-extract/pull/171) [`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/seek-oss/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/private@1.0.0

## 0.5.3

### Patch Changes

- [#166](https://github.com/seek-oss/vanilla-extract/pull/166) [`156e585`](https://github.com/seek-oss/vanilla-extract/commit/156e585cb6e3fdaed9e02d6b443a3b67c2210c37) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve missing filescope error

* [#168](https://github.com/seek-oss/vanilla-extract/pull/168) [`962d64f`](https://github.com/seek-oss/vanilla-extract/commit/962d64f82cb5afe154eeaef51689bb03baa0a7e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow camel-case CSS var names instead of converting to snake-case

## 0.5.2

### Patch Changes

- [#154](https://github.com/seek-oss/vanilla-extract/pull/154) [`f5ab957`](https://github.com/seek-oss/vanilla-extract/commit/f5ab957b34586886ef428b58de1f2b55b4ab65e0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improved conditional CSS rendering

  Previously all conditional CSS (@media and @supports) in a `.css.ts` file would merge together. This meant each unique query (e.g. `@media screen and (min-width: 700px)`) would only be rendered once. This output is ideal for file size but can lead to the conditions being rendered in the wrong order. The new strategy will still merge conditions together but only if it is considered safe to do so.

* [#152](https://github.com/seek-oss/vanilla-extract/pull/152) [`ae532f5`](https://github.com/seek-oss/vanilla-extract/commit/ae532f5a112c0e89a510fea224b43c6706ce6ac2) Thanks [@Saartje87](https://github.com/Saartje87)! - Added support for the following simple pseudo selectors

  - `::-webkit-resizer`
  - `::-webkit-scrollbar-button`
  - `::-webkit-scrollbar-corner`
  - `::-webkit-scrollbar-thumb`
  - `::-webkit-scrollbar-track-piece`
  - `::-webkit-scrollbar-track`
  - `::-webkit-scrollbar`

## 0.5.1

### Patch Changes

- [#146](https://github.com/seek-oss/vanilla-extract/pull/146) [`bf51ab5`](https://github.com/seek-oss/vanilla-extract/commit/bf51ab56f5b10474476ef61a00edaaf297a10218) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix escaped characters in selectors

## 0.5.0

### Minor Changes

- [#132](https://github.com/seek-oss/vanilla-extract/pull/132) [`4f92126`](https://github.com/seek-oss/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Introduce `addRecipe` function, exposed via `@vanilla-extract/css/recipe` entrypoint

### Patch Changes

- [#128](https://github.com/seek-oss/vanilla-extract/pull/128) [`ed76e45`](https://github.com/seek-oss/vanilla-extract/commit/ed76e450038cb7cbaf12a511fda9e2a3a6d21b96) Thanks [@ntkoopman](https://github.com/ntkoopman)! - Fix --webkit-line-clamp unit

## 0.4.4

### Patch Changes

- [#121](https://github.com/seek-oss/vanilla-extract/pull/121) [`823478b`](https://github.com/seek-oss/vanilla-extract/commit/823478b942e91a7b371743651cf1dc35823be98a) Thanks [@Brendan-csel](https://github.com/Brendan-csel)! - Fix development identifiers for Windows paths

## 0.4.3

### Patch Changes

- [#95](https://github.com/seek-oss/vanilla-extract/pull/95) [`f9ca82b`](https://github.com/seek-oss/vanilla-extract/commit/f9ca82b908b720785df271ed18d7abe048191759) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix fallbackVar type defintion

## 0.4.2

### Patch Changes

- [#84](https://github.com/seek-oss/vanilla-extract/pull/84) [`0bc4e0a`](https://github.com/seek-oss/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Validate tokens match corresponding theme contracts

- Updated dependencies [[`0bc4e0a`](https://github.com/seek-oss/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1)]:
  - @vanilla-extract/private@0.1.2

## 0.4.1

### Patch Changes

- [#63](https://github.com/seek-oss/vanilla-extract/pull/63) [`2cecc8a`](https://github.com/seek-oss/vanilla-extract/commit/2cecc8af8634b71f217d713c5a9faf989b46e353) Thanks [@fnky](https://github.com/fnky)! - Export CSSProperties type

## 0.4.0

### Minor Changes

- [#52](https://github.com/seek-oss/vanilla-extract/pull/52) [`2d98bcc`](https://github.com/seek-oss/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `createThemeVars` to `createThemeContract`

  **BREAKING CHANGE**

  ```diff
  import {
  -  createThemeVars,
  +  createThemeContract,
    createTheme
  } from '@vanilla-extract/css';

  -export const vars = createThemeVars({
  +export const vars = createThemeContract({
    color: {
      brand: null
    },
    font: {
      body: null
    }
  });
  ```

### Patch Changes

- [#50](https://github.com/seek-oss/vanilla-extract/pull/50) [`48c4a78`](https://github.com/seek-oss/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow vars to be passed as values to all style properties

## 0.3.2

### Patch Changes

- [#47](https://github.com/seek-oss/vanilla-extract/pull/47) [`a18bc03`](https://github.com/seek-oss/vanilla-extract/commit/a18bc034885a8b1cc1396b3890111067d4858626) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve dev prefixes on generated class names

  - Add file name to class names even if no debug id is present
  - If file is the index file use directory name instead

* [#49](https://github.com/seek-oss/vanilla-extract/pull/49) [`2ae4db3`](https://github.com/seek-oss/vanilla-extract/commit/2ae4db3cd442fc493ccc00fd519841b72f1381bf) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update the unit-less property map

  The original list was borrowed from the [postcss-js parser](https://github.com/postcss/postcss-js/blob/d5127d4278c133f333f1c66f990f3552a907128e/parser.js#L5), but decided to reverse engineer an updated list from [csstype](https://github.com/frenic/csstype) for more thorough coverage.

## 0.3.1

### Patch Changes

- [#45](https://github.com/seek-oss/vanilla-extract/pull/45) [`e154028`](https://github.com/seek-oss/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createThemeVars` when using null values

- Updated dependencies [[`e154028`](https://github.com/seek-oss/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64)]:
  - @vanilla-extract/private@0.1.1

## 0.3.0

### Minor Changes

- [#38](https://github.com/seek-oss/vanilla-extract/pull/38) [`156b491`](https://github.com/seek-oss/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `composeStyles` function

* [#37](https://github.com/seek-oss/vanilla-extract/pull/37) [`ae9864c`](https://github.com/seek-oss/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `mapToStyles` to `styleVariants`

  **BREAKING CHANGE**

  ```diff
  -import { mapToStyles } from '@vanilla-extract/css';
  +import { styleVariants } from '@vanilla-extract/css';

  -export const variant = mapToStyles({
  +export const variant = styleVariants({
    primary: { background: 'blue' },
    secondary: { background: 'aqua' },
  });
  ```

### Patch Changes

- [#34](https://github.com/seek-oss/vanilla-extract/pull/34) [`756d9b0`](https://github.com/seek-oss/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Reduce CSS var and identifier lengths

## 0.2.0

### Minor Changes

- [#20](https://github.com/seek-oss/vanilla-extract/pull/20) [`3311914`](https://github.com/seek-oss/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#25](https://github.com/seek-oss/vanilla-extract/pull/25) [`c4bedd5`](https://github.com/seek-oss/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460) Thanks [@markdalgleish](https://github.com/markdalgleish)! - The `createInlineTheme` function has now moved to the `@vanilla-extract/dynamic` package.

  ```diff
  -import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
  +import { createInlineTheme } from '@vanilla-extract/dynamic';
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
