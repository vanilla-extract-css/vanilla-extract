---
'@vanilla-extract/webpack-plugin': major
---

Drop support for webpack 4. The `peerDependencies` range for `webpack` is now `^5.73.0`, as the plugin now uses the native `this.getOptions()` and `this.utils.contextify()` loader context APIs instead of the `loader-utils` dependency, which has been removed.

**BREAKING CHANGE**: Projects using `@vanilla-extract/webpack-plugin` must upgrade to webpack `5.73.0` or later.
