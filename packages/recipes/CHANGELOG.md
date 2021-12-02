# @vanilla-extract/recipes

## 0.2.3

### Patch Changes

- [#520](https://github.com/seek-oss/vanilla-extract/pull/520) [`b294764`](https://github.com/seek-oss/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 0.2.2

### Patch Changes

- [#508](https://github.com/seek-oss/vanilla-extract/pull/508) [`d15e783`](https://github.com/seek-oss/vanilla-extract/commit/d15e783c960144e3b3ca74128cb2d04fbbc16df1) Thanks [@markdalgleish](https://github.com/markdalgleish)! - Add `exports` field to `package.json` so nested package paths can be imported in a Node.js ESM context

## 0.2.1

### Patch Changes

- [#416](https://github.com/seek-oss/vanilla-extract/pull/416) [`65d0840`](https://github.com/seek-oss/vanilla-extract/commit/65d08407655579fd9d2bed3fea7df43521f10055) Thanks [@benjervis](https://github.com/benjervis)! - Allow explicit false variants.

  Boolean variants in recipes can now also have a `false` case, which is handled properly by the type system and the build system.

## 0.2.0

### Minor Changes

- [#376](https://github.com/seek-oss/vanilla-extract/pull/376) [`f8082b9`](https://github.com/seek-oss/vanilla-extract/commit/f8082b9b62c57f394bf82cf05296a680c3ef177b) Thanks [@TheMightyPenguin](https://github.com/TheMightyPenguin)! - Add `RecipeVariants` type

  A utility to make use of the recipe’s type interface. This can be useful when typing functions or component props that need to accept recipe values as part of their interface.

  ```ts
  // button.css.ts
  import { recipe, RecipeVariants } from '@vanilla-extract/recipes';

  export const button = recipe({
    variants: {
      color: {
        neutral: { background: 'whitesmoke' },
        brand: { background: 'blueviolet' },
        accent: { background: 'slateblue' },
      },
      size: {
        small: { padding: 12 },
        medium: { padding: 16 },
        large: { padding: 24 },
      },
    },
  });

  // Get the type
  export type ButtonVariants = RecipeVariants<typeof button>;

  // the above will result in a type equivalent to:
  export type ButtonVariants = {
    color?: 'neutral' | 'brand' | 'accent';
    size?: 'small' | 'medium' | 'large';
  };
  ```

## 0.1.1

### Patch Changes

- [#380](https://github.com/seek-oss/vanilla-extract/pull/380) [`3ae2422`](https://github.com/seek-oss/vanilla-extract/commit/3ae24220e2187475561e0be54631558076370fa4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Add variant group names to debug IDs

* [#380](https://github.com/seek-oss/vanilla-extract/pull/380) [`3ae2422`](https://github.com/seek-oss/vanilla-extract/commit/3ae24220e2187475561e0be54631558076370fa4) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Return default variants when selection is `undefined`
