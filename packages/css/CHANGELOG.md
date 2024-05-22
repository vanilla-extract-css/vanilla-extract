# @vanilla-extract/css

## 1.15.2

### Patch Changes

- [#1335](https://github.com/vanilla-extract-css/vanilla-extract/pull/1335) [`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17) Thanks [@askoufis](https://github.com/askoufis)! - Add `types` field to `package.json`

- Updated dependencies [[`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17)]:
  - @vanilla-extract/private@1.0.5

## 1.15.1

### Patch Changes

- [#1386](https://github.com/vanilla-extract-css/vanilla-extract/pull/1386) [`e58cf9013c6f6cdfacb2a7936b3354e71138e9fb`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e58cf9013c6f6cdfacb2a7936b3354e71138e9fb) Thanks [@askoufis](https://github.com/askoufis)! - Replace `outdent` dependency with `dedent`

- [#1385](https://github.com/vanilla-extract-css/vanilla-extract/pull/1385) [`3df9b4ebc5ad7e03e5c908c10216447b7089132a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3df9b4ebc5ad7e03e5c908c10216447b7089132a) Thanks [@askoufis](https://github.com/askoufis)! - Replace `chalk` dependency with `picocolors`

## 1.15.0

### Minor Changes

- [#1379](https://github.com/vanilla-extract-css/vanilla-extract/pull/1379) [`df9fe3ee3fc0057bc14a2333a405f8229f80c214`](https://github.com/vanilla-extract-css/vanilla-extract/commit/df9fe3ee3fc0057bc14a2333a405f8229f80c214) Thanks [@ronci](https://github.com/ronci)! - Add support for passing multiple font face rules to `globalFontFace`

  **EXAMPLE USAGE:**

  ```ts
  const gentium = 'GlobalGentium';

  globalFontFace(gentium, [
    {
      src: 'local("Gentium")',
      fontWeight: 'normal',
    },
    {
      src: 'local("Gentium Bold")',
      fontWeight: 'bold',
    },
  ]);
  ```

## 1.14.2

### Patch Changes

- [#1368](https://github.com/vanilla-extract-css/vanilla-extract/pull/1368) [`90f0315`](https://github.com/vanilla-extract-css/vanilla-extract/commit/90f03153bb7c4a8d5b448eab228c46203e9cdaed) Thanks [@askoufis](https://github.com/askoufis)! - Update `@vanilla-extract/private` dependency

- Updated dependencies [[`90f0315`](https://github.com/vanilla-extract-css/vanilla-extract/commit/90f03153bb7c4a8d5b448eab228c46203e9cdaed)]:
  - @vanilla-extract/private@1.0.4

## 1.14.1

### Patch Changes

- [#1254](https://github.com/vanilla-extract-css/vanilla-extract/pull/1254) [`f373d7f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f373d7f6b59f43236dc713e1b421ef4631f392c0) Thanks [@EvgenNoskov](https://github.com/EvgenNoskov)! - Allow hyphens in class names when using a custom identifier

## 1.14.0

### Minor Changes

- [#1207](https://github.com/vanilla-extract-css/vanilla-extract/pull/1207) [`906d288`](https://github.com/vanilla-extract-css/vanilla-extract/commit/906d28881d2c3cc1f5a49f00b8b697df66a5baa4) Thanks [@CroModder](https://github.com/CroModder)! - Add some missing [simple pseudo selectors]

  [simple pseudo selectors]: https://vanilla-extract.style/documentation/styling/#simple-pseudo-selectors

### Patch Changes

- [#1215](https://github.com/vanilla-extract-css/vanilla-extract/pull/1215) [`911c8b7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/911c8b7b95b1164d2ad5fbf555209df9e8b3ad99) Thanks [@mrm007](https://github.com/mrm007)! - Replace dependency `ahocorasick` with `modern-ahocorasick`

## 1.13.0

### Minor Changes

- [#1160](https://github.com/vanilla-extract-css/vanilla-extract/pull/1160) [`e391bae`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e391baec32463c60503f631ace578a71952f8180) Thanks [@SombreroElGringo](https://github.com/SombreroElGringo)! - Users can now provide a custom identifier hashing function

## 1.12.0

### Minor Changes

- [#1114](https://github.com/vanilla-extract-css/vanilla-extract/pull/1114) [`001be83`](https://github.com/vanilla-extract-css/vanilla-extract/commit/001be8338a869f41acf19091707a2e097fd80de3) Thanks [@taylorfsteele](https://github.com/taylorfsteele)! - Supports passing multiple font face rules to `fontFace`

  **Example usage**

  ```ts
  import { fontFace, style } from '@vanilla-extract/css';

  const gentium = fontFace([
    {
      src: 'local("Gentium")',
      fontWeight: 'normal',
    },
    {
      src: 'local("Gentium Bold")',
      fontWeight: 'bold',
    },
  ]);

  export const font = style({
    fontFamily: gentium,
  });
  ```

## 1.11.1

### Patch Changes

- [#1106](https://github.com/vanilla-extract-css/vanilla-extract/pull/1106) [`8b1c965`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8b1c9651112edd9fa294e8ffbb8c873c6ab18cc7) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix "Invalid selector" errors on pseudo-elements with params

## 1.11.0

### Minor Changes

- [#955](https://github.com/vanilla-extract-css/vanilla-extract/pull/955) [`ece5fc3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ece5fc3130020aa2fdde5b0075b17695bb082b01) Thanks [@mrm007](https://github.com/mrm007)! - Add support for [cascade layers, i.e. `@layer`][cascade layers].

  Create a scoped [layer] to avoid naming collisions, or with an explicit name using [globalLayer]. Styles can then be assigned to layers using the `@layer` key within your style definition.

  ```tsx
  // layers.css.ts
  import { layer } from '@vanilla-extract/css';

  export const reset = layer('reset');
  export const framework = layer('framework');
  export const typography = layer('typography');

  // typography.css.ts
  import { style } from '@vanilla-extract/css';
  import { typography } from './layers.css';

  export const standard = style({
    '@layer': {
      [typography]: {
        fontSize: '1rem',
      },
    },
  });
  ```

  [cascade layers]: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer
  [layer]: https://vanilla-extract.style/documentation/api/layer
  [globallayer]: https://vanilla-extract.style/documentation/global-api/global-layer

## 1.10.0

### Minor Changes

- [#1030](https://github.com/vanilla-extract-css/vanilla-extract/pull/1030) [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Provide current file scope as an additional argument to the adapter methods `registerClassName` and `registerComposition`. This is to allow fine-grained caching of registered class names and class compositions per file.

### Patch Changes

- [#1030](https://github.com/vanilla-extract-css/vanilla-extract/pull/1030) [`49ff399`](https://github.com/vanilla-extract-css/vanilla-extract/commit/49ff399bf5bf23236b5574f37b4b79058678041d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Throw when `setAdapter` is called with a falsy value

## 1.9.5

### Patch Changes

- [#990](https://github.com/vanilla-extract-css/vanilla-extract/pull/990) [`3b724b9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3b724b973a79d85cd4b5ab3e34fe312610c5b2da) Thanks [@askoufis](https://github.com/askoufis)! - Align transformation of `@keyframes` rules with other rules

  This fixes a bug where invalid CSS could be generated inside `@keyframes` rules.

## 1.9.4

### Patch Changes

- [#938](https://github.com/vanilla-extract-css/vanilla-extract/pull/938) [`d02684e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d02684e1bf0e8b4f51ab2a273233ada9df57ebc9) Thanks [@adrianaferrugento](https://github.com/adrianaferrugento)! - Bump `deep-object-diff` to v1.1.9 in order to fix security vulnerability

## 1.9.3

### Patch Changes

- [#943](https://github.com/vanilla-extract-css/vanilla-extract/pull/943) [`4ecdcd7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4ecdcd727302a51d2428031e96bd48011d387c8b) Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)! - Fix a `tsc` error caused by a dependency's type declarations being unnecessarily bundled

## 1.9.2

### Patch Changes

- [#900](https://github.com/vanilla-extract-css/vanilla-extract/pull/900) [`176c026`](https://github.com/vanilla-extract-css/vanilla-extract/commit/176c026fd72bda3fc969ba0d91494540f88488cb) Thanks [@wobsoriano](https://github.com/wobsoriano)! - Bump `@emotion/hash` to 0.9.0

* [#854](https://github.com/vanilla-extract-css/vanilla-extract/pull/854) [`98f8b03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/98f8b0387d661b77705d2cd83ab3095434e1223e) Thanks [@mrm007](https://github.com/mrm007)! - Bundle TypeScript declaration files (`.d.ts`) when building packages

- [#893](https://github.com/vanilla-extract-css/vanilla-extract/pull/893) [`8ed77c2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8ed77c23ac004cd6e66b27f36100d5d5d014bc39) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where conditional styles (e.g. `@media`, `@supports`, etc) could be ordered incorrectly

## 1.9.1

### Patch Changes

- [#837](https://github.com/vanilla-extract-css/vanilla-extract/pull/837) [`9191d5a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9191d5adcdd4d129affdf5482659120e03a3d003) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve performance of selector transforms

  This issue occured on M1 Macs due to performance issues with large regex patterns.

* [#833](https://github.com/vanilla-extract-css/vanilla-extract/pull/833) [`b53558a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b53558a3872987282b23d62b0063e4d789a379f9) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix entrypoint resolving in Vitest

## 1.9.0

### Minor Changes

- [#810](https://github.com/vanilla-extract-css/vanilla-extract/pull/810) [`c38b152`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c38b152ff6dbcf0f2b4226fc167d67314ecebabb) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Support excluding file names from `generateIdentifier` output. This is available by passing a newly-added options object rather than a string.

  **Example usage**

  ```ts
  import { generateIdentifier } from '@vanilla-extract/css';

  const identifier = generateIdentifier({
    debugId,
    debugFileName: false,
  });
  ```

### Patch Changes

- [#810](https://github.com/vanilla-extract-css/vanilla-extract/pull/810) [`c38b152`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c38b152ff6dbcf0f2b4226fc167d67314ecebabb) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix spaces in debug IDs for variable names.

* [#810](https://github.com/vanilla-extract-css/vanilla-extract/pull/810) [`c38b152`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c38b152ff6dbcf0f2b4226fc167d67314ecebabb) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix file name prefix in debug names when file extension is `.cjs` or `.mjs`.

## 1.8.0

### Minor Changes

- [#807](https://github.com/vanilla-extract-css/vanilla-extract/pull/807) [`b0b3662`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b0b36626de328a8dcc5c0301d50099fbe77a5cba) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `createContainer` API

  `createContainer` creates a single scoped container name for use with CSS Container Queries. This avoids potential naming collisions with other containers.

  ```ts
  import { style, createContainer } from '@vanilla-extract/css';

  export const sidebarContainer = createContainer();

  export const sidebar = style({
    containerName: sidebarContainer,
  });

  export const navigation = style({
    '@container': {
      [`${sidebarContainer} (min-width: 400px)`]: {
        display: 'flex',
      },
    },
  });
  ```

* [#807](https://github.com/vanilla-extract-css/vanilla-extract/pull/807) [`b0b3662`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b0b36626de328a8dcc5c0301d50099fbe77a5cba) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add support for container queries via the new `@container` key.

  ```ts
  import { style } from '@vanilla-extract/css';

  export const myStyle = style({
    '@container': {
      '(min-width: 400px)': {
        display: 'flex',
      },
    },
  });
  ```

## 1.7.4

### Patch Changes

- [#804](https://github.com/vanilla-extract-css/vanilla-extract/pull/804) [`412962f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/412962fff737a6f7c80f26d347076c31cbd5905b) Thanks [@m7yue](https://github.com/m7yue)! - Fix `styleVariants` type when using the map data function

## 1.7.3

### Patch Changes

- [#788](https://github.com/vanilla-extract-css/vanilla-extract/pull/788) [`2e9d21c`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2e9d21c718ba57daa83c5ee323871ffa6ced5d47) Thanks [@Dremora](https://github.com/Dremora)! - Add `scale` to the list of unitless properties.

## 1.7.2

### Patch Changes

- [#723](https://github.com/vanilla-extract-css/vanilla-extract/pull/723) [`8467fc2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8467fc28707372f30d8b6239580244c06859a605) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Validate duplicate '@media' in media queries

## 1.7.1

### Patch Changes

- [#684](https://github.com/vanilla-extract-css/vanilla-extract/pull/684) [`e531251`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531251689b8795eebd316ae8385f1ecc5b9b8a0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve media query validation messaging

## 1.7.0

### Minor Changes

- [#651](https://github.com/vanilla-extract-css/vanilla-extract/pull/651) [`32f309f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/32f309faad90e927efc7a277d4208480c8b5122c) Thanks [@amorriscode](https://github.com/amorriscode)! - Add CSS media query validation

## 1.6.8

### Patch Changes

- [#520](https://github.com/vanilla-extract-css/vanilla-extract/pull/520) [`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

- Updated dependencies [[`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d)]:
  - @vanilla-extract/private@1.0.3

## 1.6.7

### Patch Changes

- [#514](https://github.com/vanilla-extract-css/vanilla-extract/pull/514) [`e3dfd4a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e3dfd4a54a66ebb3a3cacc0fcc94d2689f97bb40) Thanks [@benjervis](https://github.com/benjervis)! - Export the package.json for css/fileScope

  This is required to maintain backwards compatibility with older versions of webpack-plugin

## 1.6.6

### Patch Changes

- [#508](https://github.com/vanilla-extract-css/vanilla-extract/pull/508) [`d15e783`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 1.6.5

### Patch Changes

- [#504](https://github.com/vanilla-extract-css/vanilla-extract/pull/504) [`16c960f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/16c960f32a011580eb6c4d0a45479fc28729e762) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure identifiers are escaped properly

## 1.6.4

### Patch Changes

- [#489](https://github.com/vanilla-extract-css/vanilla-extract/pull/489) [`0c1ec7d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix theme contract types in TypeScript 4.5

- Updated dependencies [[`0c1ec7d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0c1ec7d5bfa5c4e66b4655c4f417f2751af7b3e3)]:
  - @vanilla-extract/private@1.0.2

## 1.6.3

### Patch Changes

- [#428](https://github.com/vanilla-extract-css/vanilla-extract/pull/428) [`e915f7f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e915f7f0c1176f8403118d867216cc19490ad13f) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure whitespace is stripped from debug Ids

## 1.6.2

### Patch Changes

- [#409](https://github.com/vanilla-extract-css/vanilla-extract/pull/409) [`a9c5cb7`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a9c5cb768ad10bd25dd1a31041733fc96cd467a0) Thanks [@benjervis](https://github.com/benjervis)! - Improve the browser runtime dev experience.

  The vanilla browser runtime now creates style tags containing the CSS itself, rather than injecting it directly into the CSSOM.

  This helps with debugability, as the generated CSS can actually be seen in the devtools.
  There are also some new attributes set on the style tags, making it easier to identify the source of each style.

## 1.6.1

### Patch Changes

- [#381](https://github.com/vanilla-extract-css/vanilla-extract/pull/381) [`b1e5936`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b1e5936db253d81cca60c31adeabd2dd0a240389) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix identfiers not respecting `NODE_ENV` for SSR builds

## 1.6.0

### Minor Changes

- [#361](https://github.com/vanilla-extract-css/vanilla-extract/pull/361) [`531044b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/531044b8c5c2d13c465ed77641d3cc6a11903ced) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Automatically add quotes to `content` values when necessary

  For example `{ content: '' }` will now return CSS of `{ content: "" }`

## 1.5.1

### Patch Changes

- [#354](https://github.com/vanilla-extract-css/vanilla-extract/pull/354) [`cdad52d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/cdad52d6e95422f4ce53b74456fd510880a4a32a) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix function serialization with older versions of the `@vanilla-extract/integration` package

## 1.5.0

### Minor Changes

- [#348](https://github.com/vanilla-extract-css/vanilla-extract/pull/348) [`c6cd1f2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c6cd1f2eee982474c213f43fc23ee38b7a8c5e42) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `addFunctionSerializer` function

  This also marks `addRecipe` as deprecated.

## 1.4.1

### Patch Changes

- [#343](https://github.com/vanilla-extract-css/vanilla-extract/pull/343) [`50bae14`](https://github.com/vanilla-extract-css/vanilla-extract/commit/50bae14bf38c8a971ad1727cb8e827c86da06772) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Cleanup adapter after processing styles

## 1.4.0

### Minor Changes

- [#326](https://github.com/vanilla-extract-css/vanilla-extract/pull/326) [`2d9b4c3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2d9b4c3e711310e55dbefe4b3430a771d95d62fd) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support passing arrays of styles to `style` and `styleVariants`

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

- [#319](https://github.com/vanilla-extract-css/vanilla-extract/pull/319) [`26832f1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/26832f162e75b72f83dba0c230295a5dfed683aa) Thanks [@nicksrandall](https://github.com/nicksrandall)! - Add `createGlobalThemeContract` function

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
    (value) => `prefix-${value}`,
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

* [#323](https://github.com/vanilla-extract-css/vanilla-extract/pull/323) [`1e7d647`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e7d6470398a0fbcbdef4118e678150932cd9275) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Support configurable identifier types

## 1.2.3

### Patch Changes

- [#284](https://github.com/vanilla-extract-css/vanilla-extract/pull/284) [`e65c029`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e65c0297a557f141cf84ca0836ee8ab4060c9d78) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix multiple top-level conditional styles in runtime version

## 1.2.2

### Patch Changes

- [#274](https://github.com/vanilla-extract-css/vanilla-extract/pull/274) [`21e2197`](https://github.com/vanilla-extract-css/vanilla-extract/commit/21e2197363fdfbf4ba2cec54ab630cd343281816) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix type errors with nested null values in theme contracts

## 1.2.1

### Patch Changes

- [#265](https://github.com/vanilla-extract-css/vanilla-extract/pull/265) [`385155f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/385155faff4eeab0bba5137383fe948999c04b2c) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix fileScope error if `composeStyles` is called at runtime

## 1.2.0

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

## 1.1.2

### Patch Changes

- [#238](https://github.com/vanilla-extract-css/vanilla-extract/pull/238) [`1ee9ba2`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1ee9ba2c5e6598450b8bac10d244b7e375e71617) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow passing of null contract tokens in `createThemeContract`

## 1.1.1

### Patch Changes

- [#235](https://github.com/vanilla-extract-css/vanilla-extract/pull/235) [`1e49dfc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createGlobalTheme` types when accepting an existing contract

- Updated dependencies [[`1e49dfc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1e49dfc4fc21ccb53870e297e5e4664b098cc22e)]:
  - @vanilla-extract/private@1.0.1

## 1.1.0

### Minor Changes

- [#206](https://github.com/vanilla-extract-css/vanilla-extract/pull/206) [`64c18f9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/64c18f976bdada1f99022e88065a8277d56b5592) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add `disableRuntimeStyles` entrypoint

  In testing environments (like `jsdom`) vanilla-extract will create and insert styles. While this is often desirable, it can be a major slowdown in your tests. If your tests don't require styles to be available, the `disableRuntimeStyles` import will disable all style creation.

  ```ts
  // setupTests.ts
  import '@vanilla-extract/css/disableRuntimeStyles';
  ```

## 1.0.1

### Patch Changes

- [#204](https://github.com/vanilla-extract-css/vanilla-extract/pull/204) [`16f77ef`](https://github.com/vanilla-extract-css/vanilla-extract/commit/16f77efba69a11fb37a43c83af8e39c1534dffea) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Ensure `:where`/`:is` selectors are supported when validating scoped selectors

## 1.0.0

### Major Changes

- [#171](https://github.com/vanilla-extract-css/vanilla-extract/pull/171) [`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Release v1

### Patch Changes

- Updated dependencies [[`84a8611`](https://github.com/vanilla-extract-css/vanilla-extract/commit/84a8611972f32a00a6cbd85267a01dd2d31be869)]:
  - @vanilla-extract/private@1.0.0

## 0.5.3

### Patch Changes

- [#166](https://github.com/vanilla-extract-css/vanilla-extract/pull/166) [`156e585`](https://github.com/vanilla-extract-css/vanilla-extract/commit/156e585cb6e3fdaed9e02d6b443a3b67c2210c37) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve missing filescope error

* [#168](https://github.com/vanilla-extract-css/vanilla-extract/pull/168) [`962d64f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/962d64f82cb5afe154eeaef51689bb03baa0a7e3) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow camel-case CSS var names instead of converting to snake-case

## 0.5.2

### Patch Changes

- [#154](https://github.com/vanilla-extract-css/vanilla-extract/pull/154) [`f5ab957`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f5ab957b34586886ef428b58de1f2b55b4ab65e0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improved conditional CSS rendering

  Previously all conditional CSS (@media and @supports) in a `.css.ts` file would merge together. This meant each unique query (e.g. `@media screen and (min-width: 700px)`) would only be rendered once. This output is ideal for file size but can lead to the conditions being rendered in the wrong order. The new strategy will still merge conditions together but only if it is considered safe to do so.

* [#152](https://github.com/vanilla-extract-css/vanilla-extract/pull/152) [`ae532f5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ae532f5a112c0e89a510fea224b43c6706ce6ac2) Thanks [@Saartje87](https://github.com/Saartje87)! - Added support for the following simple pseudo selectors

  - `::-webkit-resizer`
  - `::-webkit-scrollbar-button`
  - `::-webkit-scrollbar-corner`
  - `::-webkit-scrollbar-thumb`
  - `::-webkit-scrollbar-track-piece`
  - `::-webkit-scrollbar-track`
  - `::-webkit-scrollbar`

## 0.5.1

### Patch Changes

- [#146](https://github.com/vanilla-extract-css/vanilla-extract/pull/146) [`bf51ab5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/bf51ab56f5b10474476ef61a00edaaf297a10218) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Fix escaped characters in selectors

## 0.5.0

### Minor Changes

- [#132](https://github.com/vanilla-extract-css/vanilla-extract/pull/132) [`4f92126`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4f92126c92d853f02e73ffadfed424b594e41166) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Introduce `addRecipe` function, exposed via `@vanilla-extract/css/recipe` entrypoint

### Patch Changes

- [#128](https://github.com/vanilla-extract-css/vanilla-extract/pull/128) [`ed76e45`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ed76e450038cb7cbaf12a511fda9e2a3a6d21b96) Thanks [@ntkoopman](https://github.com/ntkoopman)! - Fix --webkit-line-clamp unit

## 0.4.4

### Patch Changes

- [#121](https://github.com/vanilla-extract-css/vanilla-extract/pull/121) [`823478b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/823478b942e91a7b371743651cf1dc35823be98a) Thanks [@Brendan-csel](https://github.com/Brendan-csel)! - Fix development identifiers for Windows paths

## 0.4.3

### Patch Changes

- [#95](https://github.com/vanilla-extract-css/vanilla-extract/pull/95) [`f9ca82b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f9ca82b908b720785df271ed18d7abe048191759) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix fallbackVar type defintion

## 0.4.2

### Patch Changes

- [#84](https://github.com/vanilla-extract-css/vanilla-extract/pull/84) [`0bc4e0a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Validate tokens match corresponding theme contracts

- Updated dependencies [[`0bc4e0a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0bc4e0a164e9167e0356557f8feee42d7889d4b1)]:
  - @vanilla-extract/private@0.1.2

## 0.4.1

### Patch Changes

- [#63](https://github.com/vanilla-extract-css/vanilla-extract/pull/63) [`2cecc8a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2cecc8af8634b71f217d713c5a9faf989b46e353) Thanks [@fnky](https://github.com/fnky)! - Export CSSProperties type

## 0.4.0

### Minor Changes

- [#52](https://github.com/vanilla-extract-css/vanilla-extract/pull/52) [`2d98bcc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2d98bccb40603585cf9eab70ff0afc52c33f803d) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `createThemeVars` to `createThemeContract`

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

- [#50](https://github.com/vanilla-extract-css/vanilla-extract/pull/50) [`48c4a78`](https://github.com/vanilla-extract-css/vanilla-extract/commit/48c4a7866a8361de712b89b06abb380bf4709656) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Allow vars to be passed as values to all style properties

## 0.3.2

### Patch Changes

- [#47](https://github.com/vanilla-extract-css/vanilla-extract/pull/47) [`a18bc03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a18bc034885a8b1cc1396b3890111067d4858626) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Improve dev prefixes on generated class names

  - Add file name to class names even if no debug id is present
  - If file is the index file use directory name instead

* [#49](https://github.com/vanilla-extract-css/vanilla-extract/pull/49) [`2ae4db3`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2ae4db3cd442fc493ccc00fd519841b72f1381bf) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update the unit-less property map

  The original list was borrowed from the [postcss-js parser](https://github.com/postcss/postcss-js/blob/d5127d4278c133f333f1c66f990f3552a907128e/parser.js#L5), but decided to reverse engineer an updated list from [csstype](https://github.com/frenic/csstype) for more thorough coverage.

## 0.3.1

### Patch Changes

- [#45](https://github.com/vanilla-extract-css/vanilla-extract/pull/45) [`e154028`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `createThemeVars` when using null values

- Updated dependencies [[`e154028`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e1540281d327fc0883f47255f710de3f9b342c64)]:
  - @vanilla-extract/private@0.1.1

## 0.3.0

### Minor Changes

- [#38](https://github.com/vanilla-extract-css/vanilla-extract/pull/38) [`156b491`](https://github.com/vanilla-extract-css/vanilla-extract/commit/156b49182367bf233564eae7fd3ea9d3f50fd68a) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `composeStyles` function

* [#37](https://github.com/vanilla-extract-css/vanilla-extract/pull/37) [`ae9864c`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ae9864c727c2edd0d415b77f738a3c959c98fca6) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Rename `mapToStyles` to `styleVariants`

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

- [#34](https://github.com/vanilla-extract-css/vanilla-extract/pull/34) [`756d9b0`](https://github.com/vanilla-extract-css/vanilla-extract/commit/756d9b0d0305e8b8a63f0ca1ebe635ab320a5f5b) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Reduce CSS var and identifier lengths

## 0.2.0

### Minor Changes

- [#20](https://github.com/vanilla-extract-css/vanilla-extract/pull/20) [`3311914`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3311914d92406cda5d5bb71ee72075501f868bd5) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure generated hashes are scoped by package

  vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

  This change adds support for pre-compilation of packages by adding package name information to identifier hashes.

* [#25](https://github.com/vanilla-extract-css/vanilla-extract/pull/25) [`c4bedd5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/c4bedd571f0c21291b58e050589b4db9465c0460) Thanks [@markdalgleish](https://github.com/markdalgleish)! - The `createInlineTheme` function has now moved to the `@vanilla-extract/dynamic` package.

  ```diff
  -import { createInlineTheme } from '@vanilla-extract/css/createInlineTheme';
  +import { createInlineTheme } from '@vanilla-extract/dynamic';
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
