# @vanilla-extract/rollup-plugin

## 1.4.2

### Patch Changes

- [#1616](https://github.com/vanilla-extract-css/vanilla-extract/pull/1616) [`e2c439f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e2c439ffa96dce570f2d472d2ca6ee40c69e3ee9) Thanks [@radnan](https://github.com/radnan)! - allow plugin to work in rolldown

## 1.4.1

### Patch Changes

- [#1627](https://github.com/vanilla-extract-css/vanilla-extract/pull/1627) [`2fcf8e8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2fcf8e89a3f09782bf9fbbf6e51c01dd4b1a2017) Thanks [@stipsan](https://github.com/stipsan)! - Include content in CSS sourcemap when bundling with the `extract` option

## 1.4.0

### Minor Changes

- [#1604](https://github.com/vanilla-extract-css/vanilla-extract/pull/1604) [`4a020ba`](https://github.com/vanilla-extract-css/vanilla-extract/commit/4a020ba48941e438fc6bdcfb472da50316db993d) Thanks [@drwpow](https://github.com/drwpow)! - Add "extract" option which bundles CSS into one bundle. Removes .css imports.

  **EXAMPLE USAGE**:

  ```ts
  vanillaExtractPlugin({
    extract: {
      name: 'bundle.css',
      sourcemap: false
    }
  });
  ```

## 1.3.17

### Patch Changes

- [#1610](https://github.com/vanilla-extract-css/vanilla-extract/pull/1610) [`2b0be1b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2b0be1be15dcdc3df3248305fe80e566cce794cd) Thanks [@askoufis](https://github.com/askoufis)! - Revert "Improve ESM package entrypoints (#1597)" to fix `Named export not found` error when importing ESM entrypoints

- Updated dependencies []:
  - @vanilla-extract/integration@8.0.4

## 1.3.16

### Patch Changes

- [#1597](https://github.com/vanilla-extract-css/vanilla-extract/pull/1597) [`a7fccf8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a7fccf8a2626d610c060e095e0b9fb48a4ca5c9e) Thanks [@drwpow](https://github.com/drwpow)! - Fix ESM import path

- Updated dependencies []:
  - @vanilla-extract/integration@8.0.3

## 1.3.15

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@8.0.2

## 1.3.14

### Patch Changes

- Updated dependencies [[`965fd03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/965fd03ff26dd324ec24734aa7700f1fe89bd483)]:
  - @vanilla-extract/integration@8.0.1

## 1.3.13

### Patch Changes

- Updated dependencies [[`5f66abb`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5f66abbd607e76d491bbb7b9bfe9c64c882a53e8), [`a8248be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a8248befac51aa51d771b9b22a46209b1fd1e3b3), [`ec0b024`](https://github.com/vanilla-extract-css/vanilla-extract/commit/ec0b024fd19c133c233445f9e860626d104f9d97), [`a8248be`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a8248befac51aa51d771b9b22a46209b1fd1e3b3)]:
  - @vanilla-extract/integration@8.0.0

## 1.3.12

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@7.1.12

## 1.3.11

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@7.1.11

## 1.3.10

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@7.1.10

## 1.3.9

### Patch Changes

- Updated dependencies [[`96dd466127374b21ad7e48e5dd168a03a96af047`](https://github.com/vanilla-extract-css/vanilla-extract/commit/96dd466127374b21ad7e48e5dd168a03a96af047)]:
  - @vanilla-extract/integration@7.1.9

## 1.3.8

### Patch Changes

- Updated dependencies [[`6668e9e069276b0fd9ccd9668403b4eeb840a11b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/6668e9e069276b0fd9ccd9668403b4eeb840a11b), [`61878f5fb21a33190ef242551c639e216ba4748a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/61878f5fb21a33190ef242551c639e216ba4748a)]:
  - @vanilla-extract/integration@7.1.8

## 1.3.7

### Patch Changes

- Updated dependencies [[`124c31c2d9fee24d937c4626cec524d527d4e55e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/124c31c2d9fee24d937c4626cec524d527d4e55e)]:
  - @vanilla-extract/integration@7.1.7

## 1.3.6

### Patch Changes

- Updated dependencies []:
  - @vanilla-extract/integration@7.1.6

## 1.3.5

### Patch Changes

- [#1335](https://github.com/vanilla-extract-css/vanilla-extract/pull/1335) [`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17) Thanks [@askoufis](https://github.com/askoufis)! - Add `types` field to `package.json`

- Updated dependencies [[`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17)]:
  - @vanilla-extract/integration@7.1.5

## 1.3.4

### Patch Changes

- Updated dependencies [[`fdafb6d`](https://github.com/vanilla-extract-css/vanilla-extract/commit/fdafb6dff4d3e4455a1a2f5e48e446e11add2c14)]:
  - @vanilla-extract/integration@7.0.0

## 1.3.3

### Patch Changes

- [#1264](https://github.com/vanilla-extract-css/vanilla-extract/pull/1264) [`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a) Thanks [@mrm007](https://github.com/mrm007)! - Update dependencies

- Updated dependencies [[`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a), [`e531c41`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e531c4170da11ba6446e256b3af04a288841491a)]:
  - @vanilla-extract/integration@6.4.0

## 1.3.2

### Patch Changes

- [#1290](https://github.com/vanilla-extract-css/vanilla-extract/pull/1290) [`5d7140e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/5d7140e03f7b10c07ccae754a4a19100467e98ad) Thanks [@smholsen](https://github.com/smholsen)! - Add Rollup v4 to peer dependencies

- [#1291](https://github.com/vanilla-extract-css/vanilla-extract/pull/1291) [`00af971`](https://github.com/vanilla-extract-css/vanilla-extract/commit/00af9715e522d9caf6e90cb138dee13580b8dea1) Thanks [@mrm007](https://github.com/mrm007)! - Update dependency `@vanilla-extract/integration`

- [#1254](https://github.com/vanilla-extract-css/vanilla-extract/pull/1254) [`f373d7f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f373d7f6b59f43236dc713e1b421ef4631f392c0) Thanks [@EvgenNoskov](https://github.com/EvgenNoskov)! - Allow hyphens in class names when using a custom identifier

## 1.3.1

### Patch Changes

- [#1262](https://github.com/vanilla-extract-css/vanilla-extract/pull/1262) [`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e) Thanks [@mrm007](https://github.com/mrm007)! - Update Babel config to target Node.js 14

- Updated dependencies [[`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e), [`610c50b`](https://github.com/vanilla-extract-css/vanilla-extract/commit/610c50b0012ece0d06530faab3f5e442a55fc39e)]:
  - @vanilla-extract/integration@6.2.5

## 1.3.0

### Minor Changes

- [#1160](https://github.com/vanilla-extract-css/vanilla-extract/pull/1160) [`e391bae`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e391baec32463c60503f631ace578a71952f8180) Thanks [@SombreroElGringo](https://github.com/SombreroElGringo)! - Users can now provide a custom identifier hashing function

## 1.2.2

### Patch Changes

- [#1084](https://github.com/vanilla-extract-css/vanilla-extract/pull/1084) [`a0fd623`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a0fd6234bfe8294639d039bd25ec7135cc3445aa) Thanks [@graup](https://github.com/graup)! - Fix emitting assets when in watch mode (#1076)

## 1.2.1

### Patch Changes

- [#1047](https://github.com/vanilla-extract-css/vanilla-extract/pull/1047) [`589d89e`](https://github.com/vanilla-extract-css/vanilla-extract/commit/589d89e93e91d94e0d2f7e8cad862faf977f534e) Thanks [@jd-oconnor](https://github.com/jd-oconnor)! - Add rollup v3 as a peer dependency

## 1.2.0

### Minor Changes

- [#827](https://github.com/vanilla-extract-css/vanilla-extract/pull/827) [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add automatic debug IDs

  Automatic debug IDs allow your styles and other identifiers (e.g. CSS Vars, keyframes, etc) to have names that more closely reflect your source code when in development. This makes it easier to understand how the CSS output links to your source code.

  ```ts
  // styles.css.ts

  // redBox ~= 'styles_redBox_asdfgj'
  const redBox = style({
    background: 'red'
  });
  ```

### Patch Changes

- Updated dependencies [[`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0), [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0), [`9cfb9a1`](https://github.com/vanilla-extract-css/vanilla-extract/commit/9cfb9a196fb84bd9d7984c1370488fd68e7ea1d0)]:
  - @vanilla-extract/integration@6.0.0

## 1.1.0

### Minor Changes

- [#668](https://github.com/vanilla-extract-css/vanilla-extract/pull/668) [`e373b51`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e373b51bfa8401e0746596adafbda350c9fad4c3) Thanks [@AndrewLeedham](https://github.com/AndrewLeedham)! - Add esbuild configurations to vite/esbuild/rollup plugins

### Patch Changes

- Updated dependencies [[`e373b51`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e373b51bfa8401e0746596adafbda350c9fad4c3)]:
  - @vanilla-extract/integration@5.0.0

## 1.0.4

### Patch Changes

- [#710](https://github.com/vanilla-extract-css/vanilla-extract/pull/710) [`e338442`](https://github.com/vanilla-extract-css/vanilla-extract/commit/e3384428ac7110ccf1f47b80817ca8c976b90b3f) Thanks [@riccardoperra](https://github.com/riccardoperra)! - Normalize import path for emitted css files

* [#706](https://github.com/vanilla-extract-css/vanilla-extract/pull/706) [`3fc5040`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3fc50406d5e57bb131eaebab42052cb1370cddff) Thanks [@graup](https://github.com/graup)! - Suppress empty sourcemap warnings

## 1.0.3

### Patch Changes

- [#693](https://github.com/vanilla-extract-css/vanilla-extract/pull/693) [`351388a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/351388ab2f4bfea13d7c2c327b86aabdb1cc2e19) Thanks [@graup](https://github.com/graup)! - Fix emitting assets when in watch mode

## 1.0.2

### Patch Changes

- [#673](https://github.com/vanilla-extract-css/vanilla-extract/pull/673) [`f6d5337`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix issue where `.css.ts` files with the same file path from other packages could have identifier collisions

- Updated dependencies [[`f6d5337`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f6d5337ae7b955add2bb4a27ffafe1ff55b1a140)]:
  - @vanilla-extract/integration@4.0.1

## 1.0.1

### Patch Changes

- Updated dependencies [[`3c9b7d9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3c9b7d9f2f7cba8635e7459c36585109b6616636)]:
  - @vanilla-extract/integration@4.0.0
