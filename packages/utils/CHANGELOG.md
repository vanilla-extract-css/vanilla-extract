# @vanilla-extract/css-utils

## 0.1.3

### Patch Changes

- [#854](https://github.com/vanilla-extract-css/vanilla-extract/pull/854) [`98f8b03`](https://github.com/vanilla-extract-css/vanilla-extract/commit/98f8b0387d661b77705d2cd83ab3095434e1223e) Thanks [@mrm007](https://github.com/mrm007)! - Bundle TypeScript declaration files (`.d.ts`) when building packages

## 0.1.2

### Patch Changes

- [#520](https://github.com/vanilla-extract-css/vanilla-extract/pull/520) [`b294764`](https://github.com/vanilla-extract-css/vanilla-extract/commit/b294764b7f3401cec88760894ff19c60ca1d4d1d) Thanks [@mattcompiles](https://github.com/mattcompiles)! - Transpile code to meet [esmodules target](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)

  This should allow code that runs in the browser to conform to most browser policies. If you need to support browsers prior to the esmodules target (e.g. IE 11) then you'll need to configure custom transpilation in your projects.

## 0.1.1

### Patch Changes

- [#119](https://github.com/vanilla-extract-css/vanilla-extract/pull/119) [`8e67bdd`](https://github.com/vanilla-extract-css/vanilla-extract/commit/8e67bdd4bd5fcb541da354f674365bac13d8373c) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add support for calc nesting

  Previously passing a calc to any of the operator methods was not supported without first being stringified. This is now handled internally.

  E.g.

  ```diff
  -  calc('10px').add(calc('20px').subtract('4px').toString())
  +  calc('10px').add(calc('20px').subtract('4px'))
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
