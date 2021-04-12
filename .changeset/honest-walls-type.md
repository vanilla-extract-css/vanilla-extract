---
'@vanilla-extract/babel-plugin': minor
'@vanilla-extract/css': minor
'@vanilla-extract/esbuild-plugin': minor
'@vanilla-extract/webpack-plugin': minor
---

Ensure generated hashes are scoped by package

vanilla-extract uses file path to ensure unique identifier (e.g. class names, CSS Variables, keyframes, etc) hashes across your application. This information is added to your `*.css.ts` files at build time. The issue with this approach is it meant `*.css.ts` files couldn't be pre-compiled when being published to npm.

This change adds support for pre-compilation of packages by adding package name information to identifier hashes.
