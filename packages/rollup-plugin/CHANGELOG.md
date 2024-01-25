# @vanilla-extract/rollup-plugin

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
    background: 'red',
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
