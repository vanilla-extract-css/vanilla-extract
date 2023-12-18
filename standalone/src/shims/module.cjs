// `node-stdlib-browser` (used by `vite-plugin-node-polyfills`) aliases `node:module` to null.
// We provide a minimal `node:module` shim so `mlly` doesn't crash.
// https://github.com/unjs/mlly/blob/c5bcca0cda175921344fd6de1bc0c499e73e5dac/src/_utils.ts#L1-L3

const { builtinModules } = require('node:module');

module.exports = {};
module.exports.builtinModules = builtinModules;
