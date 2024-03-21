---
'@vanilla-extract/vite-plugin': patch
---

Update `@vanilla-extract/css` dependency

This fixes a bug where APIs that used the `walkObject` utility (e.g. `createTheme`) would fail when used with module namespace objects inside `vite-node`.
This was due to the previous implementation using the input object's `constructor` to initialize a clone, which does not work with module namespace objects because [they do not have a `constructor` function][es6 spec].

[es6 spec]: https://262.ecma-international.org/6.0/#sec-module-namespace-objects
