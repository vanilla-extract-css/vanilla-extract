// This is used by `node-eval`. The shim contains a module cache with `@vanilla-extract/*` deps required to compile user code.

const cache = {
  '@vanilla-extract/css': require('@vanilla-extract/css'),
  '@vanilla-extract/css/adapter': require('@vanilla-extract/css/adapter'),
  '@vanilla-extract/css/fileScope': require('@vanilla-extract/css/fileScope'),
  '@vanilla-extract/css-utils': require('@vanilla-extract/css-utils'),
  '@vanilla-extract/recipes': require('@vanilla-extract/recipes'),
};

module.exports = () => (id) => cache[id];
