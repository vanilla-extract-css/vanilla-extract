# @vanilla-extract/next-plugin

## 2.3.3

### Patch Changes

- [#1262](https://github.com/vanilla-extract-css/vanilla-extract/pull/1262) [`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e) Thanks [@mrm007](https://github.com/mrm007)! - Update Babel config to target Node.js 14

- Updated dependencies [[`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e)]:
  - @vanilla-extract/webpack-plugin@2.3.2

## 2.3.2

### Patch Changes

- [#1193](https://github.com/vanilla-extract-css/vanilla-extract/pull/1193) [`a22dd4d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a22dd4da82e4338b8f13fdf66827f6e061ff2038) Thanks [@syfxlin](https://github.com/syfxlin)! - Fixes Next.js 13.5.x CSS output on Windows when using React Server Components

## 2.3.1

### Patch Changes

- [#1180](https://github.com/vanilla-extract-css/vanilla-extract/pull/1180) [`89224fe`](https://github.com/vanilla-extract-css/vanilla-extract/commit/89224fe9d68d984f818ec3d4496952e4e919a241) Thanks [@syfxlin](https://github.com/syfxlin)! - Fixes Next.js 13 CSS output on Windows when using React Server Components

- Updated dependencies [[`89224fe`](https://github.com/vanilla-extract-css/vanilla-extract/commit/89224fe9d68d984f818ec3d4496952e4e919a241)]:
  - @vanilla-extract/webpack-plugin@2.3.1

## 2.3.0

### Minor Changes

- [#1160](https://github.com/vanilla-extract-css/vanilla-extract/pull/1160) [`e391bae`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e391baec32463c60503f631ace578a71952f8180) Thanks [@SombreroElGringo](https://github.com/SombreroElGringo)! - Users can now provide a custom identifier hashing function

### Patch Changes

- Updated dependencies [[`e391bae`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e391baec32463c60503f631ace578a71952f8180)]:
  - @vanilla-extract/webpack-plugin@2.3.0

## 2.2.2

### Patch Changes

- [#1155](https://github.com/vanilla-extract-css/vanilla-extract/pull/1155) [`1cb537b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/1cb537b04b5733d5d3a697c6f355c44465c9c468) Thanks [@GeeWizWow](https://github.com/GeeWizWow)! - Fix URL statements not not respecting Next's setup for resolving assets

## 2.2.1

### Patch Changes

- [#1148](https://github.com/vanilla-extract-css/vanilla-extract/pull/1148) [`b279bb5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b279bb5fc4902abb68319f44948e0f66d60125b6) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix error when intializing plugin

## 2.2.0

### Minor Changes

- [#1105](https://github.com/vanilla-extract-css/vanilla-extract/pull/1105) [`9541d79`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9541d79722b9e0488422ee116a31567c0ac192d6) Thanks [@SukkaW](https://github.com/SukkaW)! - Fix #1101. Correctly handle Next.js configuration.

## 2.1.3

### Patch Changes

- [#1099](https://github.com/vanilla-extract-css/vanilla-extract/pull/1099) [`0d1c17a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/0d1c17a3ffa0212466370a9c0840774e73793f3a) Thanks [@shuding](https://github.com/shuding)! - Use the resolved Next.js config in `next-plugin`

## 2.1.2

### Patch Changes

- [#1060](https://github.com/vanilla-extract-css/vanilla-extract/pull/1060) [`71f1dc5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/71f1dc50d01fab62087f86d1ed1ee9025913f328) Thanks [@SuttonJack](https://github.com/SuttonJack)! - Prepare next-plugin for Next 13 App Dir support

* [#912](https://github.com/vanilla-extract-css/vanilla-extract/pull/912) [`9cefba8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cefba8aff8321b85f3349ab622fec6e344d8f0a) Thanks [@nix6839](https://github.com/nix6839)! - Add types to Nextjs plugin configuration

## 2.1.1

### Patch Changes

- [#852](https://github.com/vanilla-extract-css/vanilla-extract/pull/852) [`dfc6405`](https://github.com/vanilla-extract-css/vanilla-extract/commit/dfc640593b5c627364c5423c3110b048f51844e4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix `Cannot find module *.css.ts.vanilla.css` issue

  Previously, CSS was being output on both the client and server builds. This fix ensure CSS is only output on the client build.

## 2.1.0

### Minor Changes

- [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Remove requirement for `@vanilla-extract/babel-plugin`

  Previously, to get automatic debug IDs you needed to use Babel with the `@vanilla-extract/babel-plugin` in your config. As this is no longer the case, the `@vanilla-extract/babel-plugin` should be removed completely from your project.

### Patch Changes

- Updated dependencies [[`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0)]:
  - @vanilla-extract/webpack-plugin@2.2.0

## 2.0.2

### Patch Changes

- [#645](https://github.com/vanilla-extract-css/vanilla-extract/pull/645) [`5ebca75`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5ebca758d18e7d55d0c079c00178cb14e936ac2e) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Bump `@vanilla-extract/integration` dep

- Updated dependencies [[`5ebca75`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5ebca758d18e7d55d0c079c00178cb14e936ac2e)]:
  - @vanilla-extract/webpack-plugin@2.1.7

## 2.0.1

### Patch Changes

- [#543](https://github.com/vanilla-extract-css/vanilla-extract/pull/543) [`2c7abb1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure code is compatible with node 12

- Updated dependencies [[`2c7abb1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2c7abb1f981fc030decf01e460e2478ff84c4013)]:
  - @vanilla-extract/webpack-plugin@2.1.5

## 2.0.0

### Major Changes

- [#537](https://github.com/vanilla-extract-css/vanilla-extract/pull/537) [`014f551`](https://github.com/vanilla-extract-css/vanilla-extract/commit/014f551a16a5a42fbe46d2489f4157249d9cab1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Bump minimum version of Next to 12.0.5.

## 1.0.1

### Patch Changes

- [#443](https://github.com/vanilla-extract-css/vanilla-extract/pull/443) [`18363ee`](https://github.com/vanilla-extract-css/vanilla-extract/commit/18363ee319bf498ed97b068414f13f5383c41405) Thanks [@swudged](https://github.com/swudged)! - Support Next.js v12
