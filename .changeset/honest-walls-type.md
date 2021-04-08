---
'@vanilla-extract/babel-plugin': minor
'@vanilla-extract/css': minor
'@vanilla-extract/esbuild-plugin': minor
'@vanilla-extract/webpack-plugin': minor
---

Add `packageName` to filescopes

This change adds support for pre-compilation of packages. Prior to this change, packages consumed from `node_modules` would need to be compiled (through babel) to add filescope information. This was to ensure class names would never clash. Adding package name information to the filescope allows vanilla-extract to safely pre-compile packages before publishing to npm without risk of class name clashes.
