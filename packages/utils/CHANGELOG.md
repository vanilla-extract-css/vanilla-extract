# @vanilla-extract/css-utils

## 0.1.1

### Patch Changes

- [#119](https://github.com/seek-oss/vanilla-extract/pull/119) [`8e67bdd`](https://github.com/seek-oss/vanilla-extract/commit/8e67bdd4bd5fcb541da354f674365bac13d8373c) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add support for calc nesting

  Previously passing a calc to any of the operator methods was not supported without first being stringified. This is now handled internally.

  E.g.

  ```diff
  -  calc('10px').add(calc('20px').subtract('4px').toString())
  +  calc('10px').add(calc('20px').subtract('4px'))
  ```

## 0.1.0

### Minor Changes

- e83ad50: Initial release
