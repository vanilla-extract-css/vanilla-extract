# @mattsjones/css-core

## 0.0.15

### Patch Changes

- 71d9595: Prevent new styles from being registered dynamically after initial boot to ensure that styles are statically extractible
- 863419c: Mark utils and core as sideEffect free
- 87525d9: Expose `createInlineTheme` as a separate entrypoint
- bcfb7b0: Ensure CSS variables are always strings

## 0.0.14

### Patch Changes

- 3d39457: Remove lodash from core
- 9b1bf7e: Add 'keyframes' and 'globalKeyframes' functions
- 08c2b1f: Add 'fontFace' and 'globalFontFace' functions
- bad1361: Remove PostCSS from core
- 4360915: Add 'fallbackVar' function

## 0.0.13

### Patch Changes

- 4c031de: Add globalStyle
- 7ad9b9a: Add 'assignVars' function

## 0.0.12

### Patch Changes

- 29fa416: Fix selectors using class lists

## 0.0.11

### Patch Changes

- 8835fec: Export Adapter type
- 3ab713c: Escape generated class names

## 0.0.10

### Patch Changes

- c94979f: Add `mapToStyles` function

## 0.0.9

### Patch Changes

- 2bcf5fd: Insert rules at correct position in browser runtime
- ced409d: Wait for end of filescope to insert rules in the browser runtime. This should more accurately reflect statically extracted CSS as it allows for media query merging and other optimizations.
- 2bcf5fd: Catch invalid rules in browser runtime
