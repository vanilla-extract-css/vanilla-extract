# @mattsjones/css-webpack-plugin

## 0.0.13

### Patch Changes

- 261007e: Remove validate-loader

## 0.0.12

### Patch Changes

- 3b83142: Move validate loader setup to plugin

## 0.0.11

### Patch Changes

- e3abd5c: Remove `outputLoaders` in favour of consumers webpack config targetting '.css' files
- bad1361: Remove PostCSS from core
- Updated dependencies [3d39457]
- Updated dependencies [9b1bf7e]
- Updated dependencies [08c2b1f]
- Updated dependencies [bad1361]
- Updated dependencies [4360915]
  - @mattsjones/css-core@0.0.14

## 0.0.10

### Patch Changes

- Updated dependencies [4c031de]
- Updated dependencies [7ad9b9a]
  - @mattsjones/css-core@0.0.13

## 0.0.9

### Patch Changes

- fbb5332: Use filescope source for css resource path
- Updated dependencies [29fa416]
  - @mattsjones/css-core@0.0.12

## 0.0.8

### Patch Changes

- 8835fec: Refactor webpack plugin to typescript
- 3ab713c: Escape generated class names
- Updated dependencies [8835fec]
- Updated dependencies [3ab713c]
  - @mattsjones/css-core@0.0.11

## 0.0.7

### Patch Changes

- Updated dependencies [c94979f]
  - @mattsjones/css-core@0.0.10

## 0.0.6

### Patch Changes

- ced409d: Wait for end of filescope to insert rules in the browser runtime. This should more accurately reflect statically extracted CSS as it allows for media query merging and other optimizations.
- Updated dependencies [2bcf5fd]
- Updated dependencies [ced409d]
- Updated dependencies [2bcf5fd]
  - @mattsjones/css-core@0.0.9
