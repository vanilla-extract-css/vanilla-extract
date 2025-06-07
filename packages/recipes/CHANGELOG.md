# @vanilla-extract/recipes

## 0.5.6

### Patch Changes

- [#1597](https://github.com/vanilla-extract-css/vanilla-extract/pull/1597) [`a7fccf8`](https://github.com/vanilla-extract-css/vanilla-extract/commit/a7fccf8a2626d610c060e095e0b9fb48a4ca5c9e) Thanks [@drwpow](https://github.com/drwpow)! - Fix ESM import path

## 0.5.5

### Patch Changes

- [#1463](https://github.com/vanilla-extract-css/vanilla-extract/pull/1463) [`61878f5fb21a33190ef242551c639e216ba4748a`](https://github.com/vanilla-extract-css/vanilla-extract/commit/61878f5fb21a33190ef242551c639e216ba4748a) Thanks [@askoufis](https://github.com/askoufis)! - Export types with `export { type T }` syntax

## 0.5.4

### Patch Changes

- [#1443](https://github.com/vanilla-extract-css/vanilla-extract/pull/1443) [`2a7acc989fba707220186f2d0b824bc4cc37ad66`](https://github.com/vanilla-extract-css/vanilla-extract/commit/2a7acc989fba707220186f2d0b824bc4cc37ad66) Thanks [@DominikRusso](https://github.com/DominikRusso)! - Enable passing `undefined` variant values to recipe functions when TypeScript's `exactOptionalPropertyTypes` is enabled.

## 0.5.3

### Patch Changes

- [#1335](https://github.com/vanilla-extract-css/vanilla-extract/pull/1335) [`b8a99e4980710a34692034d5da43e584edbc3d17`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b8a99e4980710a34692034d5da43e584edbc3d17) Thanks [@askoufis](https://github.com/askoufis)! - Add `types` field to `package.json`

## 0.5.2

### Patch Changes

- [#1341](https://github.com/vanilla-extract-css/vanilla-extract/pull/1341) [`3f8b653`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3f8b65368b26100919debd4591245380322c2cd7) Thanks [@levrik](https://github.com/levrik)! - Resolve recipe function input type to simplify hover type

## 0.5.1

### Patch Changes

- [#1161](https://github.com/vanilla-extract-css/vanilla-extract/pull/1161) [`d16c22f`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d16c22f19d86bf01c1fc4bf4c8914786fb0b9cc9) Thanks [@PrettyCoffee](https://github.com/PrettyCoffee)! - Improve IDE hover of `RecipeVariants` type by explicitly resolving its output

## 0.5.0

### Minor Changes

- [#1104](https://github.com/vanilla-extract-css/vanilla-extract/pull/1104) [`fd5fac5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/fd5fac56573c65f3cd9326cfaa1d2835a7212bcb) Thanks [@aspirisen](https://github.com/aspirisen)! - Expose recipe's class names to allow their selection

* [#1104](https://github.com/vanilla-extract-css/vanilla-extract/pull/1104) [`fd5fac5`](https://github.com/vanilla-extract-css/vanilla-extract/commit/fd5fac56573c65f3cd9326cfaa1d2835a7212bcb) Thanks [@aspirisen](https://github.com/aspirisen)! - Always create a base class name for a recipe

## 0.4.0

### Minor Changes

- [#1044](https://github.com/vanilla-extract-css/vanilla-extract/pull/1044) [`3163abc`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3163abc75c2e280e96989f732e4e5e60e4941eff) Thanks [@mszczepanczyk](https://github.com/mszczepanczyk)! - Add `variants` function for accessing variant names at runtime

## 0.3.0

### Minor Changes

- [#890](https://github.com/vanilla-extract-css/vanilla-extract/pull/890) [`0906063`](https://github.com/vanilla-extract-css/vanilla-extract/commit/09060639099ec580ac90cac48c3b79f0177ecfcd) Thanks [@otaviomad](https://github.com/otaviomad)! - Add RuntimeFn as an export to recipes index

## 0.2.5

### Patch Changes

- [#704](https://github.com/vanilla-extract-css/vanilla-extract/pull/704) [`64378b0`](https://github.com/vanilla-extract-css/vanilla-extract/commit/64378b083ed6fb54f073e77b62fefee673602742) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Fix compound variants not applying when default variants get passed undefined

## 0.2.4

### Patch Changes

- [#626](https://github.com/vanilla-extract-css/vanilla-extract/pull/626) [`d91ddde`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d91dddeb0d57f2322a6e3c1936cde2a2771d7414) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Ensure missing boolean variants don't return 'undefined' in class name

## 0.2.3

### Patch Changes

- [#520](https://github.com/vanilla-extract-css/vanilla-extract/pull/520) [`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 0.2.2

### Patch Changes

- [#508](https://github.com/vanilla-extract-css/vanilla-extract/pull/508) [`d15e783`](https://github.com/vanilla-extract-css/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 0.2.1

### Patch Changes

- [#416](https://github.com/vanilla-extract-css/vanilla-extract/pull/416) [`65d0840`](https://github.com/vanilla-extract-css/vanilla-extract/commit/65d08407655579fd9d2bed3fea7df43521f10055) Thanks [@benjervis](https://github.com/benjervis)! - Allow explicit false variants.

  Boolean variants in recipes can now also have a `false` case, which is handled properly by the type system and the build system.

## 0.2.0

### Minor Changes

- [#376](https://github.com/vanilla-extract-css/vanilla-extract/pull/376) [`f8082b9`](https://github.com/vanilla-extract-css/vanilla-extract/commit/f8082b9b62c57f394bf82cf05296a680c3ef177b) Thanks [@TheMightyPenguin](https://github.com/TheMightyPenguin)! - Add `RecipeVariants` type

  A utility to make use of the recipe’s type interface. This can be useful when typing functions or component props that need to accept recipe values as part of their interface.

  ```ts
  // button.css.ts
  import {
    recipe,
    RecipeVariants
  } from '@vanilla-extract/recipes';

  export const button = recipe({
    variants: {
      color: {
        neutral: { background: 'whitesmoke' },
        brand: { background: 'blueviolet' },
        accent: { background: 'slateblue' }
      },
      size: {
        small: { padding: 12 },
        medium: { padding: 16 },
        large: { padding: 24 }
      }
    }
  });

  // Get the type
  export type ButtonVariants = RecipeVariants<
    typeof button
  >;

  // the above will result in a type equivalent to:
  export type ButtonVariants = {
    color?: 'neutral' | 'brand' | 'accent';
    size?: 'small' | 'medium' | 'large';
  };
  ```

## 0.1.1

### Patch Changes

- [#380](https://github.com/vanilla-extract-css/vanilla-extract/pull/380) [`3ae2422`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3ae24220e2187475561e0be54631558076370fa4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add variant group names to debug IDs

* [#380](https://github.com/vanilla-extract-css/vanilla-extract/pull/380) [`3ae2422`](https://github.com/vanilla-extract-css/vanilla-extract/commit/3ae24220e2187475561e0be54631558076370fa4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Return default variants when selection is `undefined`
