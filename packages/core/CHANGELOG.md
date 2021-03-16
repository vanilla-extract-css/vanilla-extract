# @mattsjones/css-core

## 0.0.10

### Patch Changes

- c94979f: Add `mapToStyles` function

## 0.0.9

### Patch Changes

- 2bcf5fd: Insert rules at correct position in browser runtime
- ced409d: Wait for end of filescope to insert rules in the browser runtime. This should more accurately reflect statically extracted CSS as it allows for media query merging and other optimizations.
- 2bcf5fd: Catch invalid rules in browser runtime
